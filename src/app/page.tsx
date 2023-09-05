"use client";
import { useState, useMemo } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import {
 
  CommandList,
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

interface PlacesAutocompleteProps {
  setSelected: (selected: { lat: number; lng: number } | null) => void;
}


export default function Places() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map />;
}

function Map() {
  const [selected, setSelected] = useState<{ lat:number,lng:number } | null>(null);
  const center = useMemo(() => ({ lat: 43.45, lng: -80.49 }), []);
  
  return (
    <>
      <div  >
        <PlacesAutocomplete setSelected={setSelected} />
      </div>
      <GoogleMap
        zoom={10}
        center={center}
        mapContainerClassName="map-container"
      >
        {selected && <Marker position={selected} />}
      </GoogleMap>
     
    </>
  );
}

 
const PlacesAutocomplete: React.FC<PlacesAutocompleteProps>= ({ setSelected} ) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address:string) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    console.log(lat)
    console.log(lng)

    setSelected({lat,lng });
  };

  return (
    <Command >
    <CommandInput
    value={value}
    onValueChange={setValue}
    disabled={!ready}
    placeholder="Search an address"
    className="combobox-input"
    />
    <CommandList >
    <CommandGroup>
    {status === "OK" &&
    data.map(({ place_id, description }) => (
    <CommandItem key={place_id} onSelect={handleSelect} >
    
    {description}
    
    </CommandItem>
    ))}
    </CommandGroup>
    </CommandList>
    </Command>
    
    );
};
