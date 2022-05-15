import '../App.css';
import { Line } from 'rc-progress';
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import styles from './styles/SendFile.module.css'
const baseUrl = "https://file-share-server-multer.herokuapp.com"
// const baseUrl = "http://localhost:5000"
const SendFile = ({ curCode, socketRef }) => {
    const [file, setFile] = useState(null)
    const [allFiles, setAllFiles] = useState([])
    const [percent, setPercent] = useState(0)
    const [uploading, setUploading] = useState(false)
    const [downloading, setDownloading] = useState(false)
    const submit = async (e) => {
        e.preventDefault()
        setUploading(true)
        const data = new FormData()
        console.log("DATA", data)
        data.append("image", file)
        const res = await axios.post(`${baseUrl}/single/${curCode}`, data, {
            onUploadProgress: data => {
                setPercent(Math.round(100 * (data.loaded / data.total)))
            }
        })
        socketRef.current.emit("reload page", curCode)
        setUploading(false)
        setPercent(0)
        getFiles()
        console.log(res.data)
    }
    socketRef.current.on("reload page", () => {
        console.log("told to reload the page client side")
        getFiles()
    }, [])

    const getFiles = useCallback(async () => {
        // setUploading(true)
        const res = await axios.get(`${baseUrl}/files/${curCode}`)
        console.log(res.data)
        setAllFiles(res.data)
    }, [curCode, setAllFiles])
    useEffect(() => {
        getFiles()
    }, [getFiles])

    const download = async (allFile) => {
        setDownloading(true)
        axios({
            url: `${baseUrl}/download/${allFile}/${curCode}`,
            method: 'GET',
            responseType: 'blob',// important
        }).then((response) => {
            // console.log("RES", response.headers)
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', allFile);
            document.body.appendChild(link);
            link.click();
        });
        setDownloading(false)

    }

    return (
        <div className={styles.megaContainer}>
            <div className={styles.container}>
                <div className={styles.sendFormContainer}>
                    <form onSubmit={submit} className={styles.sendForm}>
                        < h2 > Room Code: {curCode}</h2 >
                        <input type="file" name="image" id="image" onChange={(e) => { setFile(e.target.files[0]) }} />
                        <button action="submit">submit</button>
                        {uploading && <div className={styles.loading}>
                            <h4>{percent}%</h4>
                            <div className={styles.loadingBar}>
                                <Line percent={percent} strokeWidth={2} strokeColor="#ffffff" trailColor="#808080" trailWidth={2} />
                            </div>
                        </div>}
                    </form>

                </div>

                <div className={styles.files}>
                    {downloading && <h3 className={styles.downloading}>downloading...</h3>}
                    {
                        allFiles.map((allFile, index) => {
                            console.log(allFile)
                            return (
                                <div className={styles.singleFile} onClick={() => { download(allFile) }} key={index}>
                                    <img src="./file-icon2.png" alt="" />
                                    <h3  >{allFile}</h3>
                                </div>
                            )
                        })
                    }
                </div>
            </div >
        </div>
    );
}

export default SendFile