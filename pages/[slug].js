import Message from "../components/message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { toast } from "react-toastify";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

export default function Details() {
  const router = useRouter();
  const routerData = router.query;
  const [message, setMessage] = useState("");
  const [allMessage, setAllMessage] = useState([]);

  // Submit a message
  const submitMessage = async () => {
    // Check if the user is logged in
    if (!auth.currentUser) return routerData.push("/auth/login");
    if (!message) {
      toast.error("Can't submit an empty comment 😅", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    if (message.length > 100) {
      toast.error("Comment too long 😵‍💫", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }

    const docRef = doc(db, "posts", routerData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        userName: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });
    toast.success("Comment added 👍", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1500,
    });
    setMessage("");
  };

  // Get comments
  const getComments = async () => {
    const docRef = doc(db, "posts", routerData.id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setAllMessage(snapshot.data().comments);
    });
    return unsubscribe;
    // const docSnap = await getDoc(docRef);
    // setAllMessage(docSnap.data().comments);
  };

  useEffect(() => {
    if (!router.isReady) return;
    getComments();
  }, [router.isReady]);

  return (
    <div>
      <Message {...routerData}></Message>
      <div className="my-4">
        <div className="flex">
          <input
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            value={message}
            placeholder="Add a comment 🤓"
            className="bg-stone-800 w-full p-2 text-white text-sm rounded-l-lg"
          />
          <p
            className={`text-amber-600 font-thin text-xs p-2 bg-stone-800 ${
              message.length > 100 ? "text-red-600" : ""
            }`}
          >
            {message.length}/100
          </p>
          <button
            onClick={submitMessage}
            className="bg-amber-500 text-white py-2 px-4 text-sm rounded-r-lg"
          >
            Submit
          </button>
        </div>
        <div className="py-6">
          <h2 className="font-bold">Comments</h2>
          {allMessage?.map((message) => (
            <div className="p-4 my-4 border-2 comment" key={message.time}>
              <div className="flex items-center gap-2 mb-4">
                <img className="w-10 rounded-full" src={message.avatar} />
                <h2>{message.userName}</h2>
              </div>
              <h2>{message.message}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
