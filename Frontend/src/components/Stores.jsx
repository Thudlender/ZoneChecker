import { useState, useEffect } from 'react'
import RowEdit from './RowEdit'
const Stores = ({ stores }) => {
  if(!stores || stores.length === 0){
    return <p>No stores found.</p>
  }
  return (
    <div  className="mt-10 justify-center container grid place-items-center min-h-max gap-4"
    id="rows">
        {stores && stores.map((store) => (
              <RowEdit
              key={store.storeID}
              storeID={store.storeID}
              storeName={store.storeName}
              adminId={store.adminId}
              address={store.address}
              lat={store.lat}
              lng={store.lng}
              deliveryRadius={store.deliveryRadius}
              />
        ))}
    </div>
  )
}
export default Stores