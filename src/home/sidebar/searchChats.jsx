import React, { useState } from 'react'
import {
    collection,
    query,
    where,
    getDocs,
    setDoc,
    doc,
    updateDoc,
    serverTimestamp,
    getDoc,
  } from "firebase/firestore";

import { db } from "../../firebase/firebase";
  
const SearchChats = ({searchedUser}) => {
  const [searchResult, setSearchResult] = useState([])

  const handleSearch = async () => {
      // const collectionRef = collection(db, "users")
      // const q = query(collectionRef, where("username", "==", searchedUser))
      // const querySnapshot = await getDocs(q)
      // const documents = querySnapshot.docs.map(doc => doc.data())
      // console.log(documents)

      const collectionRef = collection(db, "users")
      const querySnapshot = await getDocs(collectionRef)
      const documents = querySnapshot.docs.map(doc => doc.data())
        
      function filter(documents, searchedUser) {
        const filteredDocuments = [];
      
        documents.forEach((item) => {
          if (item.username.toLowerCase().includes(searchedUser.toLowerCase())) {
            filteredDocuments.push(item);
          }
        });
      
        return filteredDocuments;
      }
      
      const matchingDocuments = filter(documents, searchedUser);
      setSearchResult(matchingDocuments);

    }

    handleSearch()

  return (
    <div className='SearchChatsContainer'>
        {/* <div>SearchChats</div> */}
        <div className='SearchResultContainer'>{searchResult.map((item, i) => <div key={i} className='SearchResultItem'>{item.username}</div>)}</div>
    </div>
  )
}

export default SearchChats