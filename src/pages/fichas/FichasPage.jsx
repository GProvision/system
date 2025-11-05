import { Plus, X, ListFilter } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../../components/shared/Button";
const fetchFichas = async (cb, setLoading) => {
  try {
    setLoading(true);
    const response = await fetch("/api/fichas");
    const data = await response.json();
    cb(data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};
const FichasPage = () => {
  const navigate = useNavigate();
  const [fichas, setFichas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    fetchFichas(setFichas, setLoading);
  }, []);

  return (
    <div>
      {loading && <h1>Loading...</h1>}
      {!loading && (
        <>
          <section className="container mx-auto px-4 py-8 max-w-6xl shadow-lg rounded-lg">
            <header className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-black">Fichas</h1>
              <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                <Button
                  style={formOpen ? "cancel-outline" : "default-outline"}
                  onClick={() => setFormOpen(!formOpen)}
                >
                  {formOpen ? (
                    <X className="size-4" />
                  ) : (
                    <ListFilter className="size-4" />
                  )}
                </Button>
                <Button
                  style="add-outline"
                  onClick={() => navigate("/fichas/crear")}
                >
                  <Plus className="size-4" />
                </Button>
              </form>
            </header>
          </section>
        </>
      )}
    </div>
  );
};

export default FichasPage;
