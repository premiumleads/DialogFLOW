"use client"
import React from 'react'
import DlgflChat from './components/dlgflChat'
import DynamicInfoForm from './components/DynamicInfoForm'
import Link from 'next/link'


export default function Dialogflow() {
  // Extract the project ID from the URL query parameters
  if(typeof window !== 'undefined'){
    const query = window.location.search
    const params = new URLSearchParams(query)
    const projectid = params.get('projectid') || 'cosmic-palace-356618' ;
    sessionStorage?.setItem("projectid",projectid) 
  }
  
  return (
    <div>
        <Link href="/">{"<"} Revenire </Link>
        <DlgflChat/>
        <DynamicInfoForm />

    </div>
  )
}
