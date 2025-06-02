import type { Comments } from "../types/data"

interface Props {
  setNewComment: React.Dispatch<React.SetStateAction<string>>
  newComment: string
  handleAddComment: () => void
  comments: Comments
}

export default function AddNewComment({ setNewComment, newComment, handleAddComment, comments }: Props) {

  return (
    <div className="bg-p-white p-3 rounded-[10px] md:flex gap-5 items-start">
      <textarea placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} className="flex-1 p-3 md:hidden " />
      <div className="flex items-center justify-between w-full">
        <img src={comments.currentUser.image.png} className="size-12" />
        <textarea placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} className="flex-1 p-3 hidden md:block" />
        <button className="bg-p-purple-600 rounded-[10px] px-8 py-3 text-p-white font-semibold hover:bg-p-purple-200 cursor-pointer" onClick={handleAddComment}>SEND</button>
      </div>
    </div>
  )
}

