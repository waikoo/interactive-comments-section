import { useState } from "react"
import type { Comment, Comments, CommentWithReplyingTo, User } from "../types/data"
import { v4 as uuidv4 } from 'uuid'
import Score from "./Score"
import Options from "./Options"

interface Props {
  comment: Comment
  index: number
  currentUser: User
  comments: Comments
  setComments: React.Dispatch<React.SetStateAction<Comments | null>>
  setIdToBeDeleted: React.Dispatch<React.SetStateAction<string | number | null>>
  setShowDeletionConfirmation: React.Dispatch<React.SetStateAction<boolean | null>>
}

export default function CommentCard({ comment, setComments, comments, currentUser, setShowDeletionConfirmation, setIdToBeDeleted }: Props) {
  const { id, content, createdAt, score, user, replies } = comment
  const [dynamicScore, setDynamicScore] = useState(score)
  const [isReplyClicked, setIsReplyClicked] = useState(false)
  const [newReply, setNewReply] = useState('')
  const [isContentBeingEdited, setIsContentBeingEdited] = useState(false)
  const [newContent, setNewContent] = useState(content)

  const handleScore = (type: 'add' | 'subtract') => {
    if (type === 'add') {
      if (dynamicScore === score + 1) return
      setDynamicScore(dynamicScore + 1)
    }

    if (type === 'subtract') {
      if (dynamicScore === score - 1) return
      setDynamicScore(dynamicScore - 1)
    }
  }

  const handleDelete = () => {
    setShowDeletionConfirmation(true)
    setIdToBeDeleted(id)
  }


  function addReplyToComments(
    comments: Comment[],
    parentId: string,
    newReply: Comment
  ): Comment[] {
    return comments.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies ?? []), newReply],
        };
      }

      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: addReplyToComments(comment.replies, parentId, newReply),
        };
      }

      return comment;
    });
  }

  function handleAddReply() {
    if (!newReply) {
      return
    }

    const newReplyObj: CommentWithReplyingTo = {
      id: uuidv4(),
      content: newReply,
      createdAt: 'today',
      score: 0,
      user: currentUser,
      replyingTo: user.username,
      replies: []
    }

    setNewReply('')
    setComments(prev => {
      if (!prev) return prev

      return {
        ...prev,
        comments: addReplyToComments(prev.comments, id, newReplyObj)
      }
    })
    setIsReplyClicked(!isReplyClicked)
  }

  return (
    <>
      <article className="p-3 flex gap-5 font-rubik bg-white rounded-[10px]">

        <Score handleScore={handleScore} dynamicScore={dynamicScore} className="flex-col hidden sm:flex" />

        <section className="flex flex-col gap-3 w-full">
          <div className="flex justify-between gap-3">
            <div className="flex items-center gap-3">
              <img className="size-8" src={user.image.webp} alt={`avatar of ${user.username}`} />
              <p className="font-medium text-p-grey-800">{user.username}</p>
              {user.username === currentUser?.username && (
                <div className="bg-p-purple-600 text-p-white px-2 rounded-[3px]">you</div>
              )}
              <p className="text-p-grey-500">{createdAt}</p>
            </div>

            <Options user={user} currentUser={currentUser} handleDelete={handleDelete} setIsContentBeingEdited={setIsContentBeingEdited} isContentBeingEdited={isContentBeingEdited} isReplyClicked={isReplyClicked} setIsReplyClicked={setIsReplyClicked} className="hidden sm:flex" />
          </div>

          {!isContentBeingEdited ? (
            <div className="flex-1">
              <p className="text-p-grey-500">{newContent}</p>
            </div>
          ) : (
            <textarea className="block flex-1 text-p-grey-500 w-full outline-p-grey-800 p-3 rounded-[10px] resize-none px-4" value={newContent} onChange={(e) => setNewContent(e.target.value)} />
          )
          }

          {isContentBeingEdited && (
            <button className="w-fit-content ml-auto bg-p-purple-600 rounded-[10px] px-8 py-3 text-p-white font-semibold hover:bg-p-purple-200 cursor-pointer" onClick={() => setIsContentBeingEdited(false)}>UPDATE</button>
          )
          }

          <div className="flex justify-between">

            <Score handleScore={handleScore} dynamicScore={dynamicScore} className="flex sm:hidden" />

            <Options user={user} currentUser={currentUser} handleDelete={handleDelete} setIsContentBeingEdited={setIsContentBeingEdited} isContentBeingEdited={isContentBeingEdited} isReplyClicked={isReplyClicked} setIsReplyClicked={setIsReplyClicked} className="sm:hidden" />
          </div>
        </section>
      </article>

      {isReplyClicked && (

        <article className="bg-white p-3 rounded-[10px] flex gap-3 items-start relative">
          <img src="../../images/avatars/image-juliusomo.webp" alt="avatar of juliusomo" className="size-8" />
          <textarea className="w-full outline-p-grey-800 p-3 rounded-[10px] resize-none px-4" placeholder="Add a comment" value={`${newReply}`} onChange={(e) => setNewReply(e.target.value)} />
          <button className="hover:bg-p-purple-200 bg-p-purple-600 text-white py-3 px-7 rounded-[10px] cursor-pointer font-bold block" onClick={handleAddReply}>REPLY</button>
        </article>
      )}

      {replies?.length > 0 ? (
        <section className="flex">
          <div className="w-[20px] sm:w-[70px]">
            <div className="w-[3px] h-full bg-p-grey-100 sm:mx-auto"></div>
          </div>

          <div className="flex flex-1 flex-col gap-3 ml-auto">
            {replies.map((reply, i: number) => {
              return (
                <CommentCard comment={reply} comments={comments} setComments={setComments} index={i} key={reply.id} currentUser={currentUser} setShowDeletionConfirmation={setShowDeletionConfirmation} setIdToBeDeleted={setIdToBeDeleted} />
              )
            })}
          </div>
        </section>
      ) : null}

    </>
  )
}

