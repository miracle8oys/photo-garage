import { db, storage } from "../config/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react/cjs/react.development";
import { useNavigate } from "react-router-dom";
const Upload = ({user}) => {

    const [phoroUrl, setPhotoUrl] = useState([]);
    const [progres, setProgres] = useState(0);
    const [fileCount, setFileCount] = useState(null);
    const [caption, setCaption] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e)  => {
        e.preventDefault();
        const photos = e.target[0].files;
        setFileCount(photos.length);
        for (let i = 0; i < photos.length; i++) {
            await uploadFile(photos[i]);
        }
    }

    const uploadFile = async (photo) => {

        setProgres(0);

        const uploadPhotoProcess = uploadBytesResumable(ref(storage, `${photo.name}`), photo);

        uploadPhotoProcess.on("state_changed", (snapshot) => {
            const currentProgres = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setProgres(currentProgres);
        }, (err) => {console.log(err)}, 
        () => {
            getDownloadURL(uploadPhotoProcess.snapshot.ref)
            .then(photoUrl => {
                setPhotoUrl(data => [...data, photoUrl]);
            });
        })
    }

    useEffect(() => {
        if (fileCount === phoroUrl.length) {
            uploadData();
        }
    }, [fileCount, phoroUrl])

    const uploadData = async () => {
        const postsRef = collection(db, "posts");
        const currentTime = Timestamp.now();
        await addDoc(postsRef, {
            caption,
            photo: phoroUrl,
            createdAt: currentTime,
            like: 0,
            profile_pic: user.photoURL,
            uid: user.uid,
            username: user.displayName
        });
        navigate("/");
    }

    return ( 
        <div className="min-h-[85vh] md:min-h-[80vh]">
            <form encType="multipart/form-data" onSubmit={handleSubmit} className="grid items-center gap-5 mt-3">
                <label className="block ml-auto mr-auto">
                    <span className="sr-only">Choose image</span>
                    <input type="file" className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100
                    " multiple />
                </label>
                <div className="ml-auto mr-auto">
                    <textarea onChange={(e) => setCaption(e.target.value)} className="border-2 w-72 lg:w-96 h-16"></textarea>
                </div>
                <div className="ml-auto mr-auto">
                    <button className="py-3 bg-blue-500 w-32 rounded-md">Submit</button>
                </div>
            </form>
            <div className="flex justify-center">
                <h1>{progres}</h1>
            </div>
        </div>
     );
}
 
export default Upload;