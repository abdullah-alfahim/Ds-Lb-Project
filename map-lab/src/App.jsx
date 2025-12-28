import React, { useState, useEffect } from "react";

function App() {
  const [cities, setCities] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [pathSteps, setPathSteps] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/cities")
      .then((res) => res.json())
      .then((data) => {
        setCities(data);
        if (data.length > 0) {
          setStart(data[0].id);
          setEnd(data[1].id);
        }
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setPathSteps([]);
    setErrorMsg("");

    try {
      const response = await fetch("http://localhost:8080/search", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: `${start} ${end}`,
      });

      const data = await response.json();

      if (data.path.includes("->")) {
        setPathSteps(data.path.split(" -> "));
      } else if (data.path.includes("No route") || data.path.includes("already")) {
        setErrorMsg(data.path);
      } else {
        setPathSteps([data.path]);
      }

    } catch (error) {
      setErrorMsg("Server connection failed!");
    }
    setLoading(false);
  };

  const styles = {
    wrapper: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif",
      padding: "20px"
    },
    card: {
      background: "white",
      width: "100%",
      maxWidth: "450px",
      borderRadius: "20px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      overflow: "hidden",
      padding: "30px",
    },
    header: {
      textAlign: "center",
      color: "#333",
      marginBottom: "25px",
    },
    formGroup: {
      marginBottom: "15px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      color: "#666",
      marginBottom: "5px",
      fontWeight: "600"
    },
    select: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "2px solid #eee",
      fontSize: "16px",
      outline: "none",
      transition: "0.3s",
      backgroundColor: "#f9f9f9"
    },
    btn: {
      width: "100%",
      padding: "15px",
      background: "#764ba2",
      color: "white",
      border: "none",
      borderRadius: "10px",
      fontSize: "18px",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "10px",
      transition: "transform 0.2s",
    },
    timeline: {
      marginTop: "30px",
      borderTop: "1px solid #eee",
      paddingTop: "20px",
    },
    step: {
      display: "flex",
      alignItems: "center",
      marginBottom: "15px",
      position: "relative",
    },
    stepIcon: {
      width: "30px",
      height: "30px",
      background: "#e0c3fc",
      color: "#764ba2",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "15px",
      fontWeight: "bold",
      zIndex: 2,
    },
    line: {
      position: "absolute",
      left: "14px",
      top: "30px",
      height: "25px",
      width: "2px",
      background: "#e0c3fc",
      zIndex: 1,
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.header}> Trip Planner</h2>

        <div style={styles.formGroup}>
          <label style={styles.label}>FROM</label>
          <select style={styles.select} value={start} onChange={(e) => setStart(e.target.value)}>
            {cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}
          </select>
        </div>

        <div style={{ textAlign: "center", margin: "-10px 0", fontSize: "20px", color: "#ccc" }}>⬇</div>

        <div style={styles.formGroup}>
          <label style={styles.label}>TO</label>
          <select style={styles.select} value={end} onChange={(e) => setEnd(e.target.value)}>
            {cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}
          </select>
        </div>

        <button 
          style={styles.btn} 
          onClick={handleSearch}
          onMouseOver={(e) => e.target.style.transform = "scale(1.02)"}
          onMouseOut={(e) => e.target.style.transform = "scale(1)"}
        >
          {loading ? "Searching..." : "Find Best Route 🚀"}
        </button>

        {errorMsg && (
          <div style={{ marginTop: "20px", color: "red", textAlign: "center", background: "#ffe6e6", padding: "10px", borderRadius: "8px" }}>
            {errorMsg}
          </div>
        )}

        {pathSteps.length > 0 && (
          <div style={styles.timeline}>
            <h4 style={{ margin: "0 0 15px 0", color: "#444" }}>Fastest Route:</h4>
            
            {pathSteps.map((step, index) => (
              <div key={index} style={styles.step}>
                {index !== pathSteps.length - 1 && <div style={styles.line}></div>}
                
                <div style={styles.stepIcon}>
                  {index === 0 ? "A" : (index === pathSteps.length - 1 ? "B" : "•")}
                </div>
                
                <div style={{ fontSize: "16px", fontWeight: "500", color: "#333" }}>
                  {step}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;