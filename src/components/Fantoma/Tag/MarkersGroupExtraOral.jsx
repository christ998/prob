import React from 'react'
import TagExtraOral from './TagExtraOral'

const MarkersGroup = (props) => {

    return (
        <>
            {props.markers.length > 0 ? (
                 props.markers.map(marker => (
                    <TagExtraOral key={marker.id} marker={marker} editMarker={props.editMarker} deleteMarker={props.deleteMarker} adding={props.adding}/>
                ))
            ) : (
                console.log('')
            )}        
        </>
    )    
}
export default MarkersGroup