import { useEffect, useState } from "react"
import type { Comment, Comments } from "./types/data"
import CommentCard from "./components/CommentCard"
import { v4 as uuidv4 } from 'uuid'
import AddNewComment from "./components/AddNewComment"

function App() {
  const [comments, setComments] = useState<Comments | null>(null)
  const [newComment, setNewComment] = useState('')
  const [showDeletionConfirmation, setShowDeletionConfirmation] = useState<boolean | null>(false)
  const [idToBeDeleted, setIdToBeDeleted] = useState<string | number | null>(null)

  console.log(comments)

  useEffect(() => {
    fetch("./data.json")
      .then((res) => res.json())
      .then((data) => setComments(data))
  }, [])

  if (!comments) {
    return <p>Loading...</p>
  }

  const handleAddComment = () => {
    if (!newComment) {
      return
    }

    const newCommentObj = {
      id: uuidv4(),
      content: newComment,
      createdAt: 'today',
      score: 0,
      user: comments.currentUser,
      replies: []
    }

    setComments({ ...comments, comments: [...comments.comments, newCommentObj] })
    setNewComment('')
  }

  function deleteCommentRecursively(comments: Comment[], idToDelete: number | string): Comment[] {
    return comments
      .map(comment => ({
        ...comment,
        replies: comment.replies ? deleteCommentRecursively(comment.replies, idToDelete) : [],
      }))
      .filter(comment => comment.id !== idToDelete);
  }

  function handleDelete(id: number | string) {
    if (!comments || !setComments) return
    const updatedComments = deleteCommentRecursively(comments.comments, id);

    setComments({
      ...comments,
      comments: updatedComments,
    })
    setShowDeletionConfirmation(false)
    setIdToBeDeleted(null)
  }

  return (
    <div className="bg-p-grey-50 min-h-screen p-4 py-8 sm:p-10">
      <section className="lg:w-[80%] xl:w-1/2 mx-auto flex flex-col gap-3">
        {comments.comments.map((comment, i: number) => {
          return (
            <CommentCard comment={comment} comments={comments} setComments={setComments} currentUser={comments.currentUser} setIdToBeDeleted={setIdToBeDeleted} setShowDeletionConfirmation={setShowDeletionConfirmation} index={i} key={comment.id} />
          )
        })}

        <AddNewComment newComment={newComment} setNewComment={setNewComment} handleAddComment={handleAddComment} comments={comments} />
      </section>


      {showDeletionConfirmation && (
        <section className="fixed inset-0 w-screen h-screen bg-p-grey-800/50 grid place-items-center">
          <div className="w-[350px] bg-white p-6 rounded-[10px] flex flex-col gap-3">
            <p className="font-bold text-2xl text-p-grey-800">Delete comment</p>
            <p className="text-p-grey-500">Are you sure you want to delete this comment? This will remove the comment and can't be undone.</p>
            <div className="flex gap-2 text-p-white">
              <button className="uppercase flex-1 bg-p-grey-500 p-3 rounded-[10px] font-bold cursor-pointer hover:bg-gray-300" onClick={() => setShowDeletionConfirmation(false)}>No, cancel</button>
              <button className="uppercase flex-1 bg-p-pink-400 p-3 rounded-[10px] font-bold cursor-pointer hover:bg-p-pink-200" onClick={() => handleDelete(idToBeDeleted!)}>Yes, delete</button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default App
