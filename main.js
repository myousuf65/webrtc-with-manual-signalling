import {callsCollection} from "./config/firebaseConfig.js"
import { addDoc } from "firebase/firestore"


//elements
let localVideo = document.getElementById('local-video')
let remoteVideo = document.getElementById('remote-video')
let localOffer = document.getElementById('local-offer')
let remoteOffer = document.getElementById('remote-offer')
let genLocal = document.getElementById('gen-local')
let genRemote = document.getElementById('gen-remote')
let addAnswerButton = document.getElementById('add-answer')
// variabels
let peerConnection;
let localStream;
let remoteStream;


const STUN_SERVERS = {
  iceServers : [
    {
      urls : ['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']
    }
  ]
}

async function init(){
  localStream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true
  })

  localVideo.srcObject = localStream  
}

async function createOffer(){
  peerConnection = new RTCPeerConnection(STUN_SERVERS) 

  // initailzing stream for remote
  remoteStream = new MediaStream()
  remoteVideo.srcObject = remoteStream


  console.log(localStream)
  //sending tracks 
  localStream.getTracks().forEach(track => {
    console.log(track)
    peerConnection.addTrack(track, localStream)
  });

  //receiving tracks
  peerConnection.ontrack = async (event) =>{
    event.streams[0].getTracks().forEach((track)=>{
      remoteStream.addTrack(track)
    })
  }

  // ice candidates
  peerConnection.onicecandidate = async (event) =>{
    console.log('got ice candidates')
    if (event.candidate){
      // peer connection will continue adding more to this variable
      localOffer.value = JSON.stringify(peerConnection.localDescription)
    }
  }

  let offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
  // localOffer.value = JSON.stringify(peerConnection.localDescription)
  const signalledOffer = await addDoc(callsCollection, offer )
  console.log(signalledOffer.id)
}

let createAnswer = async() => {
   peerConnection = new RTCPeerConnection(STUN_SERVERS) 

  // initailzing stream for remote
  remoteStream = new MediaStream()
  remoteVideo.srcObject = remoteStream


  console.log(localStream)
  //sending tracks 
  localStream.getTracks().forEach(track => {
    console.log(track)
    peerConnection.addTrack(track, localStream)
  });

  //receiving tracks
  peerConnection.ontrack = async (event) =>{
    event.streams[0].getTracks().forEach((track)=>{
      remoteStream.addTrack(track)
    })
  }

  // ice candidates
  peerConnection.onicecandidate = async (event) =>{
    console.log('got ice candidates')
    if (event.candidate){
      // peer connection will continue adding more to this variable
      localOffer.value = JSON.stringify(peerConnection.localDescription)
    }
  }
  

  let offer = localOffer.value
  if(!offer){
    return alert('retrive offer first')
  }

  offer = JSON.parse(offer)
  await peerConnection.setRemoteDescription(offer)

  //local localDescription for the peer
  let answer = await peerConnection.createAnswer()
  await peerConnection.setLocalDescription(answer)
  remoteOffer.value = JSON.stringify(answer)
}

let AddAnswer = async () => {
  let answer = JSON.parse(remoteOffer.value)

  if(!peerConnection.currentRemoteDescription){
    peerConnection.setRemoteDescription(answer)
  }


}

init()

genLocal.addEventListener('click', ()=> createOffer() ) 
genRemote.addEventListener('click', ()=> createAnswer() ) 
addAnswerButton.addEventListener('click', () => AddAnswer())
