import { useEffect, useState } from "react";
import "../styles/ParkingLot.css";

export default function ParkingLot() {

    const [parkingData, setParkingData] = useState({
        occupied: 0,
        total: 200
    });

    const fetchParkingData = async () => {

        try {

            const res = await fetch("http://192.168.233.106:8081/api/otopark/durum");

            const data = await res.json();

            setParkingData({
                occupied: data.occupied ?? 0,
                total: data.total ?? 200
            });

        } catch (error) {
            console.error("Otopark verisi alınamadı:", error);
        }

    };

    useEffect(() => {

        fetchParkingData();

        const interval = setInterval(fetchParkingData, 5000);

        return () => clearInterval(interval);

    }, []);

    const rows = 10;
    const cols = "ABCDEFGHIJKLMNOPQRST".split("");

    const gateCoords = ["D7", "E7", "P7", "Q7"];

    const disabledCoords = [
        ...Array.from({ length: 10 }, (_, i) => "A" + (i + 1)),
        ...Array.from({ length: 10 }, (_, i) => "B" + (i + 1))
    ];

    let parkingSlots = [];
    let disabledSlots = [];

    for (let r = 1; r <= rows; r++) {

        cols.forEach(c => {

            const coord = c + r;

            if (gateCoords.includes(coord)) return;

            if (disabledCoords.includes(coord)) {
                disabledSlots.push(coord);
            } else {
                parkingSlots.push(coord);
            }

        });

    }

    const fixedDisabledOccupied = 2;

    const shuffledDisabled = [...disabledSlots].sort(() => 0.5 - Math.random());

    const shuffledParking = [...parkingSlots].sort(() => 0.5 - Math.random());

    const occupiedDisabled = shuffledDisabled.slice(0, fixedDisabledOccupied);

    const remainingCars = Math.max(0, parkingData.occupied - fixedDisabledOccupied);

    const occupiedNormal = shuffledParking.slice(0, remainingCars);

    const allOccupied = [...occupiedDisabled, ...occupiedNormal];

    const doluluk = Math.round((parkingData.occupied / parkingData.total) * 100);

    return (

        <div className="parking-wrapper">

            <div className="hospital-gate">
                🏥 ANA HASTANE GİRİŞİ
            </div>

            <div className="grid-container">

                {cols.map(col =>
                    Array.from({ length: rows }, (_, i) => i + 1).map(row => {

                        const coord = col + row;

                        if (gateCoords.includes(coord)) return null;

                        const isDisabled = disabledCoords.includes(coord);
                        const isOccupied = allOccupied.includes(coord);

                        let className = "slot";

                        if (isDisabled) className += " disabled-slot";
                        if (isOccupied) className += " occupied";

                        return (
                            <div key={coord} className={className}>
                                {coord}
                            </div>
                        );

                    })
                )}

                <div className="gate-area gate-b">B GİRİŞİ</div>
                <div className="gate-area gate-c">C GİRİŞİ</div>

            </div>

            <div className="stats-container">

                <div className="stats-text">
                    🚗 {parkingData.occupied} / {parkingData.total}
                </div>

                <div className="progress-container">
                    <div
                        className="progress-bar"
                        style={{ width: `${doluluk}%` }}
                    />
                </div>

                <div className="percentage">
                    Doluluk %{doluluk}
                </div>

            </div>

        </div>

    );

}