import React from 'react'

const InfoButton = (props) => {
  return (
    <button onClick={props.onClick} className="px-3 py-2 text-white bg-gradient-to-r from-[#01364f] to-slate-700  hover:bg-gradient-to-l hover:from-[#01364f] hover:to-slate-700 rounded-md  tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500">{props.children}</button>
  )
}

export default InfoButton