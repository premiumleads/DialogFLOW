import React, { useEffect, useRef, useState } from 'react'
import  styles from "@/styles/ShowCreds.module.scss"
import axios from 'axios'
import { AiOutlineClose } from 'react-icons/ai'


export default function ShowCreds({data = {},changeData = ()=>{}}) {
    const [modify, setModify] = useState(false)
    const infoRef = useRef({})
    const [langs, setLangs] = useState(data.langs)
    const [knowledgebases, setKnowledgebases] = useState(data.knowledge_bases)
    const updateRow = async () => {
        setModify(false); // Set modify state to false
        let info = {};
        for (const [key, value] of Object.entries(infoRef.current)) {
          if (value?.value?.length === 0) {
            return; // Return if any input value is empty
          }
          info[key] = value.value;
        }
        info.projectID = ""; // Set projectID to an empty string
        await axios.post("/api/updateCreds", info, {
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((value, err) => {
          if (err) {
            throw err;
          }
          let rows = value.data?.creds;
          changeData(rows); // Call changeData function with updated rows
          setLangs(rows.langs); // Update langs state with new rows
        });
      }
      
      // Fetch data when modify state changes
      useEffect(() => {
        if (modify) {
          for (const [key, value] of Object.entries(infoRef.current)) {
            infoRef.current[key].value = data[key]; // Set input values to corresponding data values
          }
        }
      }, [data, modify]);
      
      console.log(langs, data);
           
  return (
    <div className={styles.showCred}>
        <div className={styles.credsDbElt}>
            {
                modify
                ?
                (
                    <>
                        <input className="form-control" type="text" name="DIALOGFLOW_PROJECT_NAME" ref={ref=>ref!=null&&(infoRef.current[ref.name] = ref)} placeholder=" Project NAME "/>
                        <input className="form-control" type="text" name="DIALOGFLOW_PROJECT_ID" ref={ref=>ref!=null&&(infoRef.current[ref.name] = ref)} placeholder=" Project ID "/>
                        <input className="form-control" type="text" name="DIALOGFLOW_JSON" ref={ref=>ref!=null&&(infoRef.current[ref.name] = ref)} placeholder=" DIALOGFLOW JSON "/>
                        {
                            //dialogflow langs
                        }
                        {
                            knowledgebases?.length>0
                            ?
                            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",alignItems:"center",justifyContent:"space-evenly",position:"relative",}}>
                                {
                                    knowledgebases?.map((item,idx)=>(
                                        <div key={idx} style={{display:"flex",alignItems:"center",justifyContent:"flex-start",position:"relative",}}>
                                            <input type="text" className='form-control' defaultValue={item.VALUE} 
                                                onChange={e=>setKnowledgebases(knowledgebases.map((item,idx)=>(idx===idx?{...item,VALUE:e.target.value}:item)))}    
                                            />
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
                            </div>
                            :
                            <p>
                                Pas de knowledge bases
                            </p>
                        }
                        {
                            !langs || langs.length===0?
                            (
                                <p>
                                    Pas de langues
                                </p>
                            ):
                            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",alignItems:"center",position:"relative",}}>
                                {                                
                                    langs?.map((item,idx)=>(
                                        <div key={idx} style={{display:"flex",alignItems:"center",justifyContent:"space-evenly",position:"relative",}}>
                                            <input type="text" className='form-control' defaultValue={item.LANG} 
                                                onChange={e=>setLangs(langs.map((item,idx)=>(idx===idx?{...item,LANG:e.target.value}:item)))}    
                                            />
                                            <p style={{fontSize:15,margin:"0"}}>
                                                . Utiliser par default?
                                            </p>
                                            <input type="checkbox" className='form-checkbox' name="set_default"  id="" 
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

                            </div>
                        }
                        <input className="form-control" type="text" name="AZURETTS_SUB_KEY" ref={ref=>ref!=null&&(infoRef.current[ref.name] = ref)} placeholder=" AZURETTS SUB KEY "/>
                        <input className="form-control" type="text" name="AZURETTS_REGION" ref={ref=>ref!=null&&(infoRef.current[ref.name] = ref)} placeholder=" AZURETTS REGION "/>
                        <input className="form-control" type="text" name="CLOUDINARY_CLOUD_NAME" ref={ref=>ref!=null&&(infoRef.current[ref.name] = ref)} placeholder=" CLOUDINARY CLOUD NAME "/>
                        <input className="form-control" type="text" name="CLOUDINARY_API_KEY" ref={ref=>ref!=null&&(infoRef.current[ref.name] = ref)} placeholder=" CLOUDINARY API KEY "/>
                        <input className="form-control" type="text" name="CLOUDINARY_API_SECRET" ref={ref=>ref!=null&&(infoRef.current[ref.name] = ref)} placeholder=" CLOUDINARY API SECRET "/>
                        <input className="form-control" type="text" name="ELEVENLABS" ref={ref=>ref!=null&&(infoRef.current[ref.name] = ref)} placeholder=" ELEVENLABS "/>
                        <input className="form-control" type="text" name="OPENAI" ref={ref=>ref!=null&&(infoRef.current[ref.name] = ref)} placeholder=" OPENAI "/>

                    </>
                )
                :
                (
                <>
                    <div>
                        <p>
                            {
                                data.DIALOGFLOW_PROJECT_NAME
                            }
                        </p>
                    </div>
                    <div>
                        <p>
                            {
                                data.DIALOGFLOW_PROJECT_ID
                            }
                        </p>
                    </div>

                    <div>
                        <p>
                            {
                                   data.DIALOGFLOW_JSON?.length>100? data.DIALOGFLOW_JSON?.slice(0,100) + " ... "  : data.DIALOGFLOW_JSON                
                            }
                        </p>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",}}>
                        {
                            data.knowledge_bases?.length>0
                            ?
                            data?.knowledge_bases?.map(item=>{return {VALUE:item.VALUE}})?.map((item,idx)=>(
                                 <p key={idx}>
                                     {
                                        item.VALUE
                                     
                                     }             
                                 </p>
                            )) 
                            :
                            <p></p>               
                        }
                    </div>
                    <div style={{display:"flex",flexDirection:"column",}}>
                        {
                            data?.langs?.map(item=>{return {LANG:item.LANG+", ",DEFAULT:item.DEFAULT}})?.map((item,idx)=>(
                                 <p key={idx}>
                                     {
                                        item.LANG + " " + (item.DEFAULT?" (default)":"")
                                     
                                     }             
                                 </p>
                            ))                
                        }
                    </div>
                    <div>
                        <p>
                            {
                                data.AZURETTS_SUB_KEY                              
                            }
                        </p>
                    </div>
                    <div>
                        <p>
                            {
                                data.AZURETTS_REGION      
                            }
                        </p>
                    </div>
                    <div>
                        <p>
                            {
                                data.CLOUDINARY_CLOUD_NAME
                            }
                        </p>
                    </div>
                    <div>
                        <p>
                            {
                                data.CLOUDINARY_API_KEY   
                            }
                        </p>
                    </div>
                    <div>
                        <p>
                            {
                                data.CLOUDINARY_API_SECRET
                            }
                        </p>
                    </div>
                    <div>
                        <p>
                            {
                                data.ELEVENLABS           
                            }
                        </p>
                    </div>
                    <div>
                        <p>
                            {
                                data.OPENAI  
                            }
                        </p>
                    </div>
                </>
                )
            }
            {
                modify?(
                <div style={{flexDirection:"column"}}>
                    <button className='btn btn-primary' onClick={updateRow}>
                        Sauvegarder
                    </button>
                    <button className='btn btn-danger' onClick={() => setModify(false)}>
                        Annuler
                    </button>
                </div>
                ):(
                <div>
                    <button className='btn btn-primary' onClick={() => setModify(true)}>
                        Modifier
                    </button>
                </div>
                )
            }
        </div>

    </div>
  )
}
