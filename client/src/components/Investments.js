function Investments() {
    const [investments, setInvestments] = useState([]);
  
    useEffect(() => {
      axios.get('http://localhost:5000/api/investments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then(res => setInvestments(res.data));
    }, []);
  
    return (
      <div>
        {investments.map(investment => (
          <div key={investment.id}>
            <h3>{investment.name}</h3>
            <p>Price per unit: ${investment.price_per_unit}</p>
          </div>
        ))}
      </div>
    );
  }
