import {initializeApp} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {getAuth,signInWithEmailAndPassword,onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {getFirestore,collection,addDoc,getDocs,deleteDoc,doc,serverTimestamp} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import {firebaseConfig} from "./firebase-config.js";
const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app),$=id=>document.getElementById(id);
window.login=async()=>{try{await signInWithEmailAndPassword(auth,$("email").value,$("password").value)}catch(e){$("loginMsg").textContent="Login হয়নি: "+e.message}};
window.logout=()=>signOut(auth);
onAuthStateChanged(auth,u=>{ $("login").hidden=!!u; $("panel").hidden=!u; if(u)load()});
window.addProduct=async()=>{let name=$("name").value.trim(),price=Number($("price").value),category=$("category").value.trim()||"অন্যান্য",image=$("image").value.trim();if(!name||!price||!image)return alert("নাম, দাম ও ছবির URL দিন।");await addDoc(collection(db,"products"),{name,price,category,image,createdAt:serverTimestamp()});["name","price","category","image"].forEach(x=>$(x).value="");load()};
async function load(){let s=await getDocs(collection(db,"products"));$("list").innerHTML=s.docs.map(d=>{let p=d.data();return `<div class="item"><img src="${p.image}"><div style="flex:1"><b>${p.name}</b><br>৳${p.price} · ${p.category}</div><button class="del" onclick="removeProduct('${d.id}')">মুছুন</button></div>`}).join("")||"কোনো পণ্য নেই।"}
window.removeProduct=async id=>{if(confirm("পণ্যটি মুছে ফেলবেন?")){await deleteDoc(doc(db,"products",id));load()}};