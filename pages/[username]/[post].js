import styles from '../../styles/Post.module.css';
import PostContent from '../../components/PostContent';
import HeartButton from '../../components/HeartButton';
import AuthCheck from '../../components/AuthCheck';
import Metatags from '../../components/Metatags';
import { UserContext } from '../../lib/context';
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';
import { doc, getDocs, getDoc, collectionGroup, query, limit, getFirestore } from 'firebase/firestore';


import Link from 'next/link';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useContext } from 'react';




export async function getStaticProps({ params }) {
    const { username, post } = params;
    console.log("postid ", params)

    const userDoc = await getUserWithUsername(username);

    let post_;
    let path;
    // console.log("userdoc ---->", userDoc.ref.path)
    if (userDoc) {
        // console.log("userdoc ", userDoc)
        // console.log("postid ", post)
        const postRef = doc(getFirestore(), userDoc.ref.path, 'posts', post);

        post_ = postToJSON(await getDoc(postRef));

        path = postRef.path;
    }

    return {
        props: { post_, path },
        revalidate: 5000,
    };
}

export async function getStaticPaths() {
    //can be improved my using Admin SDK to select empty docs
    const q = query(
        collectionGroup(getFirestore(), 'posts'),
        limit(20)
    )
    const snapshot = await getDocs(q);

    const paths = snapshot.docs.map((doc) => {
        const { postid, username } = doc.data();
        return {
            params: { username, post: postid },
        };
    });

    return {
        // paths: [
        //   { params: { username, slug }}
        // ],
        paths,
        fallback: 'blocking',
    };
}

export default function Post(props) {
    const postRef = doc(getFirestore(), props.path);
    const [realtimePost] = useDocumentData(postRef);

    const post = realtimePost || props.post_;

    const { user: currentUser } = useContext(UserContext);

    return (
        <main className={styles.container}>
            <Metatags title={post.title} description={post.title} />

            <section>
                <PostContent post={post} />
            </section>

            <aside className="card">
                <p>
                    <strong>{post.heartCount || 0} 🤍</strong>
                </p>

                <AuthCheck
                    fallback={
                        <Link href="/enter">
                            <button>💗 Sign Up</button>
                        </Link>
                    }
                >
                    <HeartButton postRef={postRef} />
                </AuthCheck>

                {currentUser?.uid === post.uid && (
                    <Link href={`/admin/${post.postid}`}>
                        <button className="btn-blue">Edit Post</button>
                    </Link>
                )}
            </aside>
        </main>
    );
}