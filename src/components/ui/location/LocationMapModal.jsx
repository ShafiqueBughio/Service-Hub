
"use client";

import { lazy, Suspense } from "react";

const MapPicker = lazy(() => import("@/components/ui/MapPicker"));

const LocationMapModal = ({
  isOpen,
  onClose,
  onConfirm,
  initialPosition = null,
}) => {
  if (!isOpen) return null;

  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
          <div className="rounded-xl bg-white px-6 py-4 text-sm text-gray-600 shadow-lg">
            Loading map...
          </div>
        </div>
      }
    >
      <MapPicker
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onConfirm}
        initialPosition={initialPosition}
      />
    </Suspense>
  );
};

export default LocationMapModal;
