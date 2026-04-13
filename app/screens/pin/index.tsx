import { SecurityService } from "@/services/SecurityService";
import React, { useEffect, useState } from "react";
import PinView from "./_pinView";

export default function Pin() {
  const [pin, setPin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchPin = async () => {
      const pinExists = await SecurityService.hasPin();
      setPin(pinExists);
      setLoading(false);
    };
    searchPin();
  }, []);

  return <PinView pin={pin} />;
}
