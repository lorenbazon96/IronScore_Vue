import { defineStore } from "pinia";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";

export const useUserStore = defineStore("user", {
  state: () => ({
    name: "",
    surname: "",
    email: "",
    age: "",
    accountType: "",
  }),

  actions: {
    async fetchUser() {
      const user = auth.currentUser;
      console.log("Trenutni korisnik:", user);
      if (!user) return;

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          this.name = data.name || "";
          this.surname = data.surname || "";
          this.email = data.email || "";
          this.age = data.age || "";
          this.accountType = data.type || ""; // ako se zove 'type' u bazi
        }
      } catch (err) {
        console.error("Greška kod dohvaćanja korisnika:", err.message);
      }
    },
  },
});
