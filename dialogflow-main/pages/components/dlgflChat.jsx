import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { createRoot } from "react-dom/client";
import axios from "axios";
import { generateMp3, languagesArr, voicesArr } from '../textToSpeech';
import styles from "@/styles/dlgflChat.module.scss"
import { RawWebsocketMessage } from 'microsoft-cognitiveservices-speech-sdk/distrib/lib/src/common/RawWebsocketMessage';


export default function DlgflChat() {

  const [toggleChatBot, setToggleChatBot] = useState(false)
  //states
  const [selectedLang, setSelectedLang] = useState("")
  const [selectedVoice, setSelectedVoice] = useState("")
  //text to speech script
  const [languages, setlanguages] = useState(languagesArr)
  const [voices, setvoices] = useState(voicesArr)
  const [lang, setLang] = useState("fr")
  const [typeLanguageAgent, setTypeLanguageAgent] = useState("en")
  const [prjs, setPrjs] = useState([])
  const [selectLangs, setSelectLangs] = useState([])
  const [male, setMale] = useState(true)
  const [data, setData] = useState([])
  //code js of dialogflow
  //https://chat-dialogflow-production.up.railway.app/website
  let baseUrl = "/api/dialogflow/";

  // Session Init (is important so that each user interaction is unique)--------------------------------------
  function session() {
    let navigator_info = {};
    let screen_info = {};
    let uid = '';

    if (typeof window !== 'undefined') {
      navigator_info = window.navigator || {};
      screen_info = window.screen || {};
      uid += navigator_info.mimeTypes?.length;
      uid += navigator_info.userAgent.replace(/\D+/g, "");
      uid += navigator_info.plugins?.length;
      uid += screen_info.height || "";
      uid += screen_info.width || "";
      uid += screen_info.pixelDepth || "";
      //console.log("💛💛💛 uid" , uid); 
    }

    return uid;
  }

  // Call Session init
  var mysession = session();
  // //console.log(mysession);


  //------------------------------------------- Send request to backend ---------------------------------------
  function send(text, mysession) {

    axios
      .get(baseUrl, { params: { text, mysession, lang, typeLanguageAgent, projectid: sessionStorage.getItem("projectid") } })
      .then((response) => {
        //inject object response in div 
        console.log(response)
        //document.getElementById("result_obj").innerText = (JSON.stringify(response, null, 2));
        //console.log("💛💛💛 data received from server :", response.data.result);
        //generate text from response text

        console.log(response.data.result);
        generateMp3(
          response.data.result?.fulfillmentMessages?.text?.text?.at(0) || response.data.result?.text
          , lang === "fr" ? "fr-FR" : "en-US"
          , lang === "fr" ? male ? "fr-FR-AlainNeural" : "fr-FR-CelesteNeural" : male ? "en-US-EricNeural" : "en-Us-ElizabethNeural"
          , "dlgfl-div-mp3"
        );
        main(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //------------------------------------- Set user response in result_div ------------------------------------
  function setUserResponse(val) {
    //console.log("setting user response ", val)
    var UserResponse =
      `
        <div class="content-block">
          <p class="userEnteredText"> 
            ${val} 
          </p>
        </div>
        <div class="clearfix"></div>
      `;


    const root = createRoot(document?.getElementById("result_div"));
    const resultDiv = document.getElementById("result_div");
    resultDiv.innerHTML = resultDiv.innerHTML + UserResponse;
    if (document) {
      document.getElementById("chat-input").value = "";
    }
    scrollToBottomOfResults();

    showSpinner();

    if (document?.querySelector(".suggestion")) {
      document.querySelector(".suggestion").style.display = "none";
    }
  };
  //---------------------------------- Scroll to the bottom of the results div -------------------------------
  function scrollToBottomOfResults() {
    //var terminalResultsDiv = document?.getElementById("result_div");
    //terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
    window?.scrollTo(0, 0)
  };
  //---------------------------------------- Ascii Spinner ---------------------------------------------------
  function showSpinner() {
    if (document?.querySelector(".spinner")) {
      document.querySelector(".spinner").style.display = "flex";
    }
  };
  function hideSpinner() {
    if (document?.querySelector(".spinner")) {
      document.querySelector(".spinner").style.display = "none";
    }
  };
  //------------------------------------------- Suggestions ------------------------------------------
  function addSuggestion(textToAdd) {
    var suggestions = textToAdd;
    var suggLength = textToAdd?.length;
    document.getElementById("result_div").innerHTML += '<p className="suggestion"></p>';
    // ('<div className="sugg-title">Suggestions: </div>').appendTo(".suggestion");
    for (i = 0; i < suggLength; i++) {
      document.querySelector(".suggestion").at(0).innerHTML += `<span className="sugg-options" onClick={()=>suggessionSpanHandler()}> { suggestions[i]} </span>`
    }
    scrollToBottomOfResults();
  };
  //------------------------------------------- Main function ------------------------------------------------
  function main(data) {
    console.log("💛💛💛 data arrived to main function : ", data);
    render(data)
    let intentData = {
      text: data.text,
      querytext: data.querytext,
      displayName: data.displayName,
      fulfillmentMessages: data.fulfillmentMessages,
      // name:data.name,
      // chatres:data.chatres,
      fulfillmentText: data.fullfillmentText

    }
    // let intentData = data[0].queryResult.fulfillmentMessages[0].text.text[0];
    //console.log("💚💚💚💚💚 the chatbot response text : " ,intentData);

    setTimeout(function () {
      // if(intentData.querytext ==="hi" || intentData.querytext==="hello"){
      // setBotResponse(intentData.text);

      // }else {
      console.log(intentData)
      setBotResponse(intentData.fulfillmentMessages?.text?.text?.at(0) || intentData.text);
      // }
      // if (intentData.mysession?.length > 0) 
      //   addSuggestion(intentData.buttons);
      // }
    }, getRndInteger(500, 1000));

    //----------------------------------- Get a random number -------------------------------------------------
    function getRndInteger(min, max) {
      let rNumb = Math.floor(Math.random() * (max - min)) + min;
      //console.log(rNumb);
      return rNumb;
    };

    //------------------------------------ Set bot response in result_div -------------------------------------
    function setBotResponse(val) {
      if (val.trim() == "") {
        //console.log("💛💛💛 setBotResponse : ",val );

        val = "I couldn't get that. Let's try something else!";
        var BotResponse =
          `
          <p class="botResult">
              ${val}  
          </p>
          <div class="clearfix"></div>
        `

        const resultDiv = document.getElementById("result_div");
        resultDiv.innerHTML = resultDiv.innerHTML + BotResponse;
        //console.log("💛💛💛 BotResponse1",BotResponse );

      } else {

        // val = val.replace(new RegExp("\r?\n", "g"), "<br />");
        var BotResponse =
          `
          <div class="content-block">
            <p class="botResult"> 
              ${val}
            </p>
          </div>
          <div class="clearfix"></div>
        `

        const resultDiv = document.getElementById("result_div");
        resultDiv.innerHTML = resultDiv.innerHTML + BotResponse;
        //console.log("💛💛💛 BotResponse2",BotResponse );

      }
      scrollToBottomOfResults();
      hideSpinner();
      document?.querySelector("#chat-input").focus();

    };

  }
  //----------------------------------------------- Suggestions end ----------------------------------
  //to render dlgfl response on html
  function render(data) {
    //console.log("data >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><")
    //console.log(data)
    let intentData = {
      text: data.text,
      querytext: data.querytext,
      displayName: data.displayName,
      // name:data.name,
      // chatres:data.chatres,
      fulfillmentText: data.fullfillmentText
    }
    //console.log(intentData.displayName);
    if (document) {
      document.getElementById("displayName").innerHTML = intentData.displayName;
      document.getElementById("text").innerHTML = intentData.text
      document.getElementById("fullfillmentText").innerHTML = intentData.fulfillmentText;
    }
    // document?.getElementById("name").innerHTML = intentData.name;
    // document?.getElementById("chatres").innerHTML = intentData.chatres;

  }

  //----------------------------------------- on input/text enter ---------------------------------------------
  const inputHandler = function (e) {
    var keyCode = e.keyCode || e.which;
    var text = e.target.value;
    if (keyCode === 13) {
      if (text == "" || text.trim() == "") {
        e.preventDefault();
        return false;
      } else {
        //e.target.value.blur();
        setUserResponse(text);
        //console.log("💛💛💛 setUserResponse : ",text);
        // //console.log( "----mysession",mysession);

        send(text, mysession);
        e.preventDefault();
        return false;
      }
    }
  };

  const suggessionSpanHandler = function () {
    var text = this.innerText;
    setUserResponse(text);
    send(text);
    document?.querySelector(".suggestion").remove();
  };

  //select change handler 
  const selectHandler = e => {

    if (e.target.value?.length > 0) {
      if (e.target.name === "voice") {
        if (
          languages.filter(item =>
            (item.slice(0, 5)) !== e.target.value.slice(0, 5)).length > 0
        ) {
          setlanguages(
            languagesArr.filter(item =>
              (item.slice(0, 5)) === e.target.value.slice(0, 5)
            )
          )
        }
        /*else{
          setvoices(voicesArr)
        }*/

        setSelectedVoice(e.target?.value)
      } else {
        if (
          voices.filter(item =>
            (item.slice(0, 5)) !== e.target.value.slice(0, 5)).length > 0
        ) {
          setvoices(
            voicesArr.filter(item =>
              (item.slice(0, 5)) === e.target.value.slice(0, 5))
          )
        }
        setSelectedLang(e.target?.value)
        /*else{
          setlanguages(languagesArr)
        }*/
      }
    } else {

      //initializing arrays once value === ""

      if (e.target.name === "voice") {
        setvoices(voicesArr)
        setSelectedVoice("")
      } else {
        setlanguages(languagesArr)
        setSelectedLang("")
      }
    }
  }
  useEffect(() => {
    const getPrjs = async () => {
      await axios.get("/api/getCreds", {
        headers: {
          'Content-Type': 'application/json',
        },
        params:{
          user_id:sessionStorage.getItem("user_info")?JSON.parse(sessionStorage.getItem("user_info"))?.id:null
        }
      }).then((value, err) => {
        if (err) {
          throw err;
        }
        let rows = value?.data;
        setData(rows)
        setPrjs(rows?.map(item => item?.DIALOGFLOW_PROJECT_ID))
        /*let res = [];
        rows?.map(item => item?.langs?.map((elt) => res.push({id:item.DIALOGFLOW_PROJECT_ID, lang:elt.LANG})))
        setSelectLangs(
          res
        )*/
      });
    }
    getPrjs();
  }, [])
  console.log(selectLangs)
  return (
    <div className='dialogflow-container'>
      <h2 id="displayName">display name  </h2>
      <h2 id="text">text </h2>
      <h2 id="fullfillmentText">fullfillment  Text</h2>
      <h2 id="name">name  </h2>
      <h2 id="chatres"> chatres </h2>
      <div id="dlgfl-div-mp3"></div>
      <div id="result_obj"></div>
      <div className={styles.preferencesChatbot}>
        <h3>
          Selectioner votre preferences du chatbot
        </h3>
        <select
          name="chatbot-name"
          className="form-select"
          onChange={
            (e) => {
               if(e.target.value?.length === 0){
                 setSelectLangs([]);
                 sessionStorage.removeItem("projectid") ;
               } else{
                console.log(e.target.value)
                setSelectLangs(data.filter(item=>item.DIALOGFLOW_PROJECT_ID===e.target.value)?.at(0)?.langs?.map((elt) => ({id:elt.DIALOGFLOW_PROJECT_ID_FK, lang:elt.LANG})));
                 sessionStorage.setItem("projectid", e.target.value);
               }
            }
          }
          id=""
        >
          <option value="">
            Selectioner un des agents du db
          </option>
          {
            prjs.map((item, key) => (
              <option value={item} key={key}>
                {
                  item
                }
              </option>
            ))
          }
        </select>
        <select name="chatbot-name" className="form-select" onChange={(e) => {setLang(e.target.value);setTypeLanguageAgent(e.target.value)}} id="">
          <option value="fr">
            Selectioner le type de votre agent chatbot
          </option>
          {
            selectLangs?.length>0?(
              
                selectLangs?.map((item, idx) => (

                  <option value={item.lang} key={idx}>
                    {
                      item.lang
                    }
                  </option>
                ))
              
            ):(
              <>
                <option value="en">
                  Anglais
                </option>
                <option value="fr">
                  Français
                </option>
              </>
            )
          }
        </select>
        {/* <select name="language" id="language-select" className="form-select"
          onChange={e => setTypeLanguageAgent(e.target.value)} >
          <option value="en">
            Selectionner la langage du chatbot
          </option>
          <option value="en">
            Anglais
          </option>
          <option value="fr">
            Français
          </option>
        </select> */}
        <select name="gender" id="gender-select" className="form-select"
          onChange={e => setMale(e.target.value === "male")} >
          <option value="male">
            Selectionner le gendre du chatbot
          </option>
          <option value="female">
            Female
          </option>
          <option value="male">
            Male
          </option>
        </select>
        {/* <select name="language" id="language-select" className="form-select"
              onChange={e=>selectHandler(e)} 
                >
                <option value="">
                  Select Language
                </option>
                {
                  languages.map((item,key)=>(
                    <option key={key} selected={item===selectedLang}  value={item}>
                      {
                        item
                      }
                    </option>
                  ))
                }
          </select>
          <select name="voice" id="voice-select" className="form-select" 
              onChange={e=>selectHandler(e)} >
                <option value="">
                  Select voice
                </option>
                {
                  voices.map((item,key)=>(
                    <option key={key} selected={item===selectedVoice} value={item} >
                      {
                        item
                      }
                    </option>
                  ))
                }
          </select> */}
      </div>
      <mybot>
        <div className="chatCont" id="chatCont" style={{ display: toggleChatBot ? "block" : "none" }}>
          <div className="bot_profile" style={{ display: toggleChatBot ? "block" : "none" }}>
            <div className="close" onClick={() => setToggleChatBot(!toggleChatBot)}>
              <i className="fa fa-times" aria-hidden={toggleChatBot}></i>
            </div>
          </div>
          <div id="result_div" className="resultDiv"></div>
          <div className="chatForm" id="chat-div" style={{ display: toggleChatBot ? "block" : "none" }}>
            <div className="spinner">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
            <input type="text" id="chat-input" autoComplete="off" placeholder="Type a message"
              onChange={e => inputHandler(e)}
              onKeyDown={e => inputHandler(e)}
              className="form-control bot-txt" />
          </div>
        </div>
        <div className="profile_div" style={{ display: !toggleChatBot ? "block" : "none" }} onClick={() => setToggleChatBot(!toggleChatBot)}>
          <div className="row">
            <div className="col-hgt">
              <Image src="/img/icons8-chat-96.png" alt='' className="img-circle img-profile" width={65} height={65} />
            </div>
          </div>
        </div>
      </mybot>
    </div>
  )
}
