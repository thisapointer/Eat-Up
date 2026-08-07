import { useState, useRef } from "react";
import RestaurantSummary from "../restaurant/RestaurantSummary";
import RestaurantDetailTabs from "../restaurant/RestaurantDetailTabs";
import "../../styles/MapRestaurantSheet.css";

function MapRestaurantSheet({ restaurant,sheetMode, onSheetModeChange, onClose, onLikeToggle, }) {
    const dragStartYRef = useRef(null);
    const isDraggingRef = useRef(false);

    const handlePointerDown = (event) => {
        dragStartYRef.current = event.clientY;
        isDraggingRef.current = false;
        event.currentTarget.setPointerCapture(event.pointerId);
    };


    const handlePointerMove = (event) => {
        if(dragStartYRef.current === null) {
            return;
        }

        const dragDistance = event.clientY - dragStartYRef.current;

        if(Math.abs(dragDistance) > 8) {
            isDraggingRef.current = true;
        }
    };

    const handlePointerUp = (event) => {
        if(dragStartYRef.current === null) {
            return;
        }

        const dragDistance = event.clientY - dragStartYRef.current;

        if(dragDistance < -40) {
            onSheetModeChange("expanded");
        } else if (dragDistance > 40) {
            onClose();
        } else if (!isDraggingRef.current) {
            if(sheetMode === "preview") {
                onSheetModeChange("expanded");
            } else {
                onSheetModeChange("preview");
            }
        }

        dragStartYRef.current = null;
        isDraggingRef.current = false;
    };

    return (
        <aside
            className={`map-restaurant-sheet map-restaurant-sheet--${sheetMode}`}
            aria-label="선택한 식당 정보"
        >
            <button
                className="map-restaurant-sheet-handle"
                type="button"
                aria-label="바텀시트 펼치기 또는 닫기"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            />

            <div className="map-restaurant-sheet-inner">
                <RestaurantSummary restaurant={restaurant} onLikeToggle={onLikeToggle} />

                {sheetMode === "expanded" && (
                    <RestaurantDetailTabs restaurant={restaurant} />
                )}
            </div>
        </aside>
    );
}


export default MapRestaurantSheet;