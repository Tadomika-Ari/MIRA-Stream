// @ts-nocheck
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom'
import homelogo from '../assets/maisonclair.png'
import cameralogo from '../assets/filmclair.png'
import { Plyr as VideoPlayer } from "plyr-react"
import "plyr-react/plyr.css"


export default function Player() {
    const { fileName } = useParams()
    const videoSrc = fileName
        ? `http://localhost:8000/api/video/${encodeURIComponent(fileName)}`
        : ""
    const source = {
        type: "video",
        sources: videoSrc ? [{ src: videoSrc, type: "video/mp4" }] : [],
    }
    const options = {
        autoplay: true,
    }
    return (
        <div>
            <section>
                <VideoPlayer source={source} options={options} />
            </section>
        </div>
    );
}