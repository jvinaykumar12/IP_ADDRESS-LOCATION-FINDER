import React from 'react';

export default function Sample () {
    const [name,setName] = React.useState('')

    return (
        <div>
            <input onChange={(e)=>{setName(e.target.value)}}>{name}</input>
        </div>
    )
}