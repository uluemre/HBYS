import React from 'react';

export const Sidebar = ({ rol, aktifSekme, setAktifSekme, logout }) => {
    const menuItems = [
        { name: "Ana Sayfa", icon: "🏠" },
        { name: rol === "DOKTOR" ? "Doktor Bilgileri" : "Kişisel Bilgiler", icon: "👤" },
        { name: "Randevularım", icon: "📅" }
    ];

    if (rol === "HASTA") menuItems.push({ name: "Tahlillerim", icon: "🧪" });
    menuItems.push({ name: "Otopark Durumu", icon: "🅿️" });
    if (rol === "PERSONEL") menuItems.push({ name: "Personel", icon: "👥" });
    if (rol === "DOKTOR") menuItems.push({ name: "Çalışma Takvimi", icon: "🗓️" });

    return (
        <aside style={{
            width: '260px',
            minWidth: '260px',
            height: '100vh',
            backgroundColor: '#0f2027',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '4px 0 20px rgba(0,0,0,0.2)',
            zIndex: 10,
            flexShrink: 0,
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '22px 20px',
                backgroundColor: 'rgba(0,0,0,0.25)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
                <span style={{ fontSize: '26px' }}>🏥</span>
                <span style={{
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    color: '#38bdf8',
                    letterSpacing: '3px',
                }}>HBYS</span>
            </div>

            <nav style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                padding: '16px 10px',
                overflowY: 'auto',
            }}>
                {menuItems.map((item) => {
                    const isActive = aktifSekme === item.name;
                    return (
                        <button
                            key={item.name}
                            onClick={() => setAktifSekme(item.name)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                border: 'none',
                                borderRadius: '10px',
                                background: isActive
                                    ? 'linear-gradient(135deg, #1a5f7a, #2980b9)'
                                    : 'transparent',
                                color: isActive ? '#ffffff' : '#94a3b8',
                                fontSize: '0.9rem',
                                fontWeight: isActive ? 600 : 500,
                                cursor: 'pointer',
                                textAlign: 'left',
                                width: '100%',
                                boxShadow: isActive ? '0 4px 14px rgba(26,95,122,0.4)' : 'none',
                                transition: 'all 0.2s ease',
                                fontFamily: 'Poppins, sans-serif',
                            }}
                            onMouseEnter={e => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                                    e.currentTarget.style.color = '#e2e8f0';
                                }
                            }}
                            onMouseLeave={e => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#94a3b8';
                                }
                            }}
                        >
                            <span style={{ fontSize: '1.1rem', width: '22px', textAlign: 'center' }}>
                                {item.icon}
                            </span>
                            <span>{item.name}</span>
                        </button>
                    );
                })}
            </nav>

            <div style={{
                padding: '14px 10px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
                <button
                    onClick={logout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(239,68,68,0.1)',
                        color: '#f87171',
                        border: '1px solid rgba(239,68,68,0.25)',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'Poppins, sans-serif',
                        transition: 'all 0.25s',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = '#ef4444';
                        e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
                        e.currentTarget.style.color = '#f87171';
                    }}
                >
                    🚪 <span>Çıkış Yap</span>
                </button>
            </div>
        </aside>
    );
};