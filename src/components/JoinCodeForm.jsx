import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const JoinCodeForm = () => {
  const [value, setValue] = useState('')
  const navigate = useNavigate()

const handleJoin = async (e) => {
  e.preventDefault();

  const trimmed = value.trim();
  if (!trimmed) return;

  let roomId = trimmed;

  if (trimmed.includes("/s/")) {
    roomId = trimmed.split("/s/")[1]?.split(/[/?#]/)[0] || trimmed;
  }
// toast lagana hai 
  try {
    const roomRef = doc(db, "rooms", roomId);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) {
      alert("❌ Room does not exist.");
      return;
    }

    navigate(`/s/${roomId}`);
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
};

  return (
    <form onSubmit={handleJoin} className="flex flex-col gap-4 ">
      <div className="relative border border-purple-900/40 px-3 py-3 ">
        <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-purple-900/90" />
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-purple-900/90" />
        <label className="block text-[10px] tracking-widest text-text-muted uppercase mb-1.5">Room code or link</label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="abc1234"
          autoFocus
          className="w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={!value.trim()}
        className="bg-purple-600 text-white text-sm tracking-wide py-3 hover:bg-purple-700 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-elevated"
      >
        [ JOIN ]
      </button>
    </form>
  )
}

export default JoinCodeForm