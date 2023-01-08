import type { Subscriber, Unsubscriber, Updater, Writable} from "svelte/store";

class Store<T> implements Writable<T> {
  constructor(
      private key: string
  ) {
      this.storage = []
  }

  private storage //: StorageArea

  set(value: T): void {
      this.storage.set({[this.key]: value})
  }

  subscribe(run: Subscriber<T>): Unsubscriber {
      const subscriberArray = []
      subscriberArray.push(run)
      this.storage.get(this.key, item => {
          run(item[this.key])
      })
      return () => subscriberArray.splice(subscriberArray.indexOf(run), 1)
  }

  update(updater: Updater<T>): void {
      this.storage.get(this.key, item => {
          const newItem = updater(item[this.key])
          this.set(newItem)
      })
  }
}
