import { useNotifications, Notification } from "hooks/useNotifications"

type Message = Notification & {
  onClick: () => void,
}

export function Notifications() {
  const { notifications, remove } = useNotifications()
  return (
    <div className="fixed top-0 right-0 mr-4 mt-4 px-4 py-4">
      {notifications.map(message => <Message key={message.id} onClick={() => remove(message.id)} {...message} />)}
    </div>
  )
}

function Message(props: Message) {
  const { message, type, description, onClick } = props

  const types: Record<Message['type'], string> = {
    error: 'bg-[#320000] border-red-900',
    success: 'bg-[#001c08] border-green-900',
    warning: 'bg-[#221600] border-amber-900',
    info: 'bg-[#000f22] border-blue-900'
  }

  return (
    <div className={`text-white animate-slide-in cursor-pointer min-w-[280px] p-4 mb-4 rounded-lg border ${types[type]} hover:translate-x-2 transition-transform`} onClick={onClick}>
      <h4>{message}</h4>
      {description ? <p>{description}</p> : null}
    </div>
  )
}