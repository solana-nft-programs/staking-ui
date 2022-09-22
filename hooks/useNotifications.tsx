import { useEffect } from "react"
import create from "zustand"

export type Notification = {
  id: number,
  type: 'success' | 'warning' | 'error' | "info"
  message: string, // title
  description?: string
}

type State = {
  notifications: Notification[],
  add: (payload: Notification) => void,
  remove: (id?: number) => void
}

const notificationsStore = create<State>((set) => ({
  notifications: [],
  add: (notification) => set(state => ({
    notifications: [...state.notifications, notification] 
  })),
  remove: (id) => set(state => {
    let updated: Notification[] = []

    if (id) {
      updated = state.notifications.filter(message => message.id !== id)  
    } else {
      updated = state.notifications.filter((_, idx) => idx !== 0)
    }

    return ({
      notifications: updated
    })
  })
}))

export function useNotifications() {
  const { add, remove, notifications } = notificationsStore(state => state)

  useEffect(() => {
    let timer = setTimeout(() => {
      remove()
    }, 4500)

    return () => clearTimeout(timer)
  }, [notifications])

  function notify({ message, type, description }: Omit<Notification, 'id'>) {
    const lastElement = notifications[notifications.length - 1]
    const lastId = lastElement ? lastElement.id + 1 : 0

    add({ message, description, type, id: lastId })
  }

  return { notify, notifications, remove }
}