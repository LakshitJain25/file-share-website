import React, { useState, useRef } from 'react'
import io from 'socket.io-client'
// import axios from 'axios'
import styles from './styles/RoomCode.module.css'
const RoomCode = ({ setCurCode, setSocketRef }) => {
    const [code, setCode] = useState(null)
    const socketRef = useRef()
    const baseUrl = "https://file-share-server-multer.herokuapp.com"
    // const baseUrl = "http://localhost:5000"

    const connect = (codeInt) => {
        socketRef.current = io.connect(baseUrl)
        setSocketRef(socketRef)
        socketRef.current.emit("check code", codeInt)
        setCurCode(codeInt);
    }

    const submitHandler = (e) => {
        e.preventDefault()
        console.log(code, typeof (code))
        const codeInt = parseInt(code)
        if (code.length === 4) {
            connect(codeInt)
        }
    }
    const generateCode = () => {
        return Math.floor(Math.random() * (1 + 9999 - 1000)) + 1000;
    }



    return (
        <div className={styles.container}>
            <h1 className={styles.mainHeading}>Transfer Files Fast And Easily</h1>
            <div className={styles.subContainer}>
                <form action="" onSubmit={(e) => { submitHandler(e) }} className={styles.form}>
                    <h2 className={styles.roomCode}>Have a room code?</h2>
                    <input type="number" className={styles.codeInput} name="code" maxLength="4" placeholder='enter roomcode' onChange={(e) => setCode(e.target.value)} />
                    <button type='submit'>Join</button>
                    <img src={"./file-share.gif"} alt="gif" className={styles.fileTrans} />
                </form>
                <button onClick={() => { connect(generateCode()) }}>create Room</button>
            </div>
        </div>
    )
}

export default RoomCode