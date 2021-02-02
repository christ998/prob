import React from 'react'
import Tag from './Tag'

const MarkersGroup = (props) => {

    return (
        <>
            {props.markers.length > 0 ? (
                 props.markers.map(marker => (
                    <Tag key={marker.id} marker={marker} editMarker={props.editMarker} deleteMarker={props.deleteMarker} orientationHelper={props.orientationHelper} positionHelper={props.positionHelper} adding={props.adding}/>
                ))
            ) : (
                console.log('')
            )}        
        </>
    )    
}
export default MarkersGroup