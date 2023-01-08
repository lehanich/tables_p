import { createEventDispatcher,setContext, getContext } from 'svelte';

const LABEL = "SVELTE:EVENTBUS:DISPATCHER";

export function initEventbus(component){
  console.log("even bus init")

    const parent_dispatch = getContext(LABEL);
    console.log("event bus parrent",parent_dispatch)
    const dispatch = createEventDispatcher();
    setContext(LABEL,(type,details)=>{
        const list = Object.keys(component.$$.callbacks);
        console.dir(list)
        console.log("event bus ", list)
        if(list.includes(type))
            dispatch(type,details);
        else if(parent_dispatch) 
            parent_dispatch(type,details);
    });
}

export function createEventbusDispatcher(){
    return getContext(LABEL);
}
