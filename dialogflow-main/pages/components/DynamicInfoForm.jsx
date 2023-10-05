import axios from "axios";
import { useEffect, useRef, useState } from "react";
import  styles from "@/styles/DynamicInfoForm.module.scss"
import ShowCreds from "./ShowCreds";
import {AiOutlineClose} from 'react-icons/ai'
 


export default function DynamicInfoForm() {
    const [data, setData] = useState([]);
    const [langs, setLangs] = useState([]);
    const [knowledgebases, setKnowledgebases] = useState([]);
    const validators = {
      'DIALOGFLOW_PROJECT_NAME': {
        validate: function(value) {
          return value.length > 0;
        },
        error: 'Project name should be 1-30 characters long and only contain alphanumeric characters, underscores, and hyphens.'
      },
      'DIALOGFLOW_JSON': {
        validate: function(value) {
          // This field is a file input, so it should have a `files` property
          try {
            console.log(value);
            JSON.parse(value);
            return true;
          } catch (error) {
            return false;
          }
        },
        error: 'Please select a JSON file for dialogflow json column.'
      },
      'KNOWLEDGE_BASE': {
        validate: function(value) {
          return value.length > 0;
        },
        error: 'Please add at least one Knowledge base.'
      },
      'DIALOGFLOW_LANGUAGES': {
        validate: function(value) {
          return value.length > 0;
        },
        error: 'Please add at least one language.'
      },
      'AZURETTS_SUB_KEY': {
        validate: function(value) {
          return value.length > 0;
        },
        error: 'AzureTTS Sub Key should be 1-30 characters long and only contain alphanumeric characters, underscores, and hyphens.'
      },
      'AZURETTS_REGION': {
        validate: function(value) {
          return value.length > 0;
        },
        error: 'AzureTTS Region should be 1-30 characters long and only contain alphanumeric characters, underscores, and hyphens.'
      },
      'CLOUDINARY_CLOUD_NAME': {
        validate: function(value) {
          return value.length > 0;
        },
        error: 'Cloudinary Cloud Name should be 1-30 characters long and only contain alphanumeric characters, underscores, and hyphens.'
      },
      'CLOUDINARY_API_SECRET': {
        validate: function(value) {
          return value.length > 0;
        },
        error: 'Cloudinary API Secret should be 1-30 characters long and only contain alphanumeric characters, underscores, and hyphens.'
      },
      'CLOUDINARY_API_KEY': {
        validate: function(value) {
          return value.length > 0;
        },
        error: 'Cloudinary API Key should be 1-30 characters long and only contain alphanumeric characters, underscores, and hyphens.'
      },
    };
  
    useEffect(() => {
      let getData = async () => {
        try {
          await axios.get("/api/getCreds", {
            headers: {
              'Content-Type': 'application/json',
            },
          }).then((value, err) => {
            if (err) {
              throw err;
            }
            console.log(value);
            let rows = value.data;
            setData(rows);
          });
        } catch (error) {
          console.log(error);
        }
      }
      getData();
    }, []);
  
    const infoRef = useRef({});
  
    const saveInfo = async (e) => {
      e.preventDefault();
      try {
        let info = {};
        // Collecting data from inputs
        for (const [key, value] of Object.entries(infoRef.current)) {
          /*if(value?.value?.length===0){
              return;
          }*/
          info[key] = value?.value?.trim();
        }
        info.DIALOGFLOW_JSON = sessionStorage.getItem("DIALOGFLOW_JSON");
        info.USER_ID = 1;
        info.langs = langs;
        console.log(info);
        for (const [key, value] of Object.entries(info)) {
          // Validate each field with its corresponding validator
          console.log(key, validators[key]);
          if (!validators[key]?.validate(value)) {
            // Validation failed, show error message and stop
            throw validators[key].error;
          }
        }
        await axios.post("/api/saveCreds", info, {
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((value, err) => {
          if (err) {
            throw err;
          }
          let rows = value.data?.creds;
  
          setData(rows);
        });
        for (const [key, value] of Object.entries(infoRef.current)) {
          if (infoRef[key])
            infoRef[key].value = "";
        }
        //window.location.reload()
      } catch (error) {
        console.log(error);
        alert(error);
      }
    };
  
    const uploadFileHandler = e => {
      // Treat and read the file 
      // Affect it into info ref
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = function(event) {
        const jsonString = event.target.result;
        const jsonData = JSON.parse(jsonString);
        const stringifiedJson = JSON.stringify(jsonData);
        //infoRef.current["DIALOGFLOW_JSON"] = {value:stringifiedJson};
        sessionStorage.setItem("DIALOGFLOW_JSON", stringifiedJson);
        infoRef.current["DIALOGFLOW_PROJECT_ID"] = { value: jsonData.project_id };
      };
      reader.readAsText(file);
    };  
    console.log(data)
  return (
    <div className={styles.credsForm}>
        <h2>
            Ajouter votre informations  
        </h2>
        
        <form action="" onSubmit={(e)=>saveInfo(e)}>
            <div>
                <p>
                    DIALOGFLOW PROJECT NAME
                </p>
                <input className="form-control" type="text" name="DIALOGFLOW_PROJECT_NAME" ref={ref=>ref!=null&&(infoRef.current[ref.name] = ref)} placeholder=" Project Name "/>
            </div>
            <div>
                <p>
                    DIALOGFLOW JSON
                </p>
                {/* <input className="form-control" type="text" name="DIALOGFLOW_JSON" ref={ref=>ref!=null&&(infoRef.current[ref.name] = ref)} placeholder=" DIALOGFLOW JSON "/> */}
                <input className="form-control" type="file" name="DIALOGFLOW_JSON" ref={ref=>ref!=null&&(infoRef.current[ref.name] = ref)} onChange={e=>uploadFileHandler(e)} placeholder=" DIALOGFLOW JSON "/>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                <p>
                    DIALOGFLOW KNOWLEDGE BASE
                </p>
                {
                    knowledgebases.map((item,idx)=>(
                        <div key={idx} className="card" style={{
                            display:"block",
                            minWidth:"200px",
                            position: "relative",
                            margin: 5,
                            padding: "5% 7%",
                        }}>
                            <div style={{display:"flex",alignItems:"center",justifyContent:"space-evenly"}}>
                                <p key={idx} style={{
                                    margin:"0"
                                }} >
                                    {item?.VALUE}
                                </p>
                            </div>
                            <AiOutlineClose 
                                fontSize={22}
                                style={{
                                    position:"absolute",
                                    right:"0",
                                    top:"0",
                                    cursor:"pointer"
                                }}
                                onClick={()=>setKnowledgebases(knowledgebases.filter((item,index)=>index!==idx))}
                             />
                        </div>
                    ))
                }
                <input 
                    className="form-control"   
                    type="text" 
                    name="KNOWLEDGE_BASE" 
                    /*ref={ref=>ref!=null&&(infoRef.current[ref.name] = ref)} */ 
                    placeholder=" Knowledge Base  "
                    onKeyUp={e=>
                        {
                            e.key==="Enter" 
                            && 
                            (
                                setKnowledgebases([...knowledgebases,{VALUE:e.target.value?.trim()}]),
                                e.target.value = ""

                            )
                        }
                    } 
                    />
            </div>
            {
                //add dialogflow langs here
            }
            <div >
                <p>
                    DIALOGFLOW LANGUAGES
                </p>
                {
                    langs.map((item,idx)=>(
                        <div key={idx} className="card" style={{
                            display:"block",
                            minWidth:"200px",
                            position: "relative",
                            margin: 5,
                            padding: "5% 7%",
                        }}>
                            <div style={{display:"flex",alignItems:"center",justifyContent:"space-evenly"}}>
                                <p key={idx} style={{
                                    margin:"0"
                                }} >
                                    {item?.LANG}
                                </p>
                                <p style={{fontSize:15,margin:"0"}}>
                                    . Utiliser par default?
                                </p>
                                <input type="checkbox" name="set_default"  id="" 
                                style={{
                                    width:"50px",
                                    margin:"0"
                                }}
                                onChange={(e)=>setLangs(langs.map((item,index)=>{
                                    if(idx===index){
                                        item.DEFAULT = e.target.checked;
                                    }
                                    return item;
                                }))} />
                            </div>
                            <AiOutlineClose 
                                fontSize={22}
                                style={{
                                    position:"absolute",
                                    right:"0",
                                    top:"0",
                                    cursor:"pointer"
                                }}
                                onClick={()=>setLangs(langs.filter((item,index)=>index!==idx))}
                             />
                        </div>
                    ))
                }
                <input 
                    className="form-control"   
                    type="text" 
                    name="DIALOGFLOW_LANGUAGES" 
                    onKeyUp={e=>
                        {
                            e.key==="Enter" 
                            && 
                            (
                                setLangs([...langs,{LANG:e.target.value?.trim(),DEFAULT:false}]),
                                e.target.value = ""

                            )
                        }
                    } 
                    placeholder=" DIALOGFLOW LANGUAGES  "/>
            </div>
            <div>
                <p>
                    AZURETTS SUB KEY
                </p>
                <input className="form-control" type="text" name="AZURETTS_SUB_KEY" ref={ref=>ref!=null&&(infoRef.current[ref.name] = ref)} placeholder=" AZURETTS_SUB_KEY "/>
            </div>
            <div>
                <p>
                    AZURETTS REGION
                </p>
                <input className="form-control" type="text" name="AZURETTS_REGION" ref={ref=>ref!=null&&(infoRef.current[ref.name] = ref)} placeholder=" AZURETTS REGION "/>
            </div>
            <div>
                <p>
                    CLOUDINARY CLOUD NAME
                </p>
                <input className="form-control" type="text" name="CLOUDINARY_CLOUD_NAME" ref={ref=>ref!=null&&(infoRef.current[ref.name] = ref)} placeholder=" CLOUDINARY CLOUD NAME "/>
            </div>
            <div>
                <p>
                    CLOUDINARY API SECRET
                </p>
                <input className="form-control" type="text" name="CLOUDINARY_API_SECRET" ref={ref=>ref!=null&&(infoRef.current[ref.name] = ref)} placeholder=" CLOUDINARY API SECRET "/>
            </div>
            <div>
                <p>
                    CLOUDINARY API KEY
                </p>
                <input className="form-control" type="text" name="CLOUDINARY_API_KEY" ref={ref=>ref!=null&&(infoRef.current[ref.name] = ref)} placeholder=" CLOUDINARY API KEY "/>
            </div>
            <div>
                <p>
                    elevenlabs
                </p>
                <input className="form-control" type="text" name="ELEVENLABS" ref={ref=>ref!=null&&(infoRef.current[ref.name] = ref)} placeholder=" Webhook et API key "/>
            </div>
            <div>
                <p>
                    openai
                </p>
                <input className="form-control" type="text" name="OPENAI" ref={ref=>ref!=null&&(infoRef.current[ref.name] = ref)} placeholder=" Key "/>
            </div>
            <input 
                className="form-control btn btn-primary" 
                type="submit" 
                value="Enregistrer" 
                style={{width:"25%"}} 
            />
        </form>
        <h2>
            L{"'"}info du base de donné
        </h2>
        <div className={styles.credsDB}>
            <div className={styles.credsDbElt}>
                <div>
                    <p>
                        {/**Dialogflow */}
                        Dialogflow Project Name
                    </p>
                </div>
                <div>
                    <p>
                        {/**Dialogflow */}
                        Dialogflow ProjectID
                    </p>
                </div>
                <div>
                    <p>
                        {/**Dialogflow */}
                        Dialogflow JSON 
                    </p>
                </div>
                <div>
                    <p>
                        {/**Dialogflow */}
                        Dialogflow Knowledge Bases
                    </p>
                </div>
                <div>
                    <p>
                        {/**Dialogflow */}
                        Dialogflow Languages
                    </p>
                </div>
                <div>
                    <p>
                        {/** Webhook azure text to speech */}
                        AZURETTS SUB KEY
                    </p>
                </div>
                <div>
                    <p>
                        {/** Webhook azure text to speech */}
                        AZURETTS REGION
                    </p>
                </div>
                <div>
                    <p>
                        {/** Webhook Cloudinary */}
                        CLOUDINARY CLOUD NAME
                    </p>
                </div>
                <div>
                    <p>
                        {/** Webhook Cloudinary */}
                        CLOUDINARY API KEY
                    </p>
                </div>
                <div>
                    <p>
                        {/** Webhook Cloudinary */}
                        CLOUDINARY API SECRET
                    </p>
                </div>
                <div>
                    <p>
                        {/** Webhook Elevenlabs */}
                        ELEVENLABS
                    </p>
                </div>
                <div>
                    <p>
                        {/** Webhook Elevenlabs */}
                        OpenAI
                    </p>
                </div>
            </div>

            {
                data?.map((item,idx)=>(
                    <ShowCreds data={item} key={idx} changeData = {v=>setData(v)} />
                ))
            }
        </div>
    </div>
  );
}