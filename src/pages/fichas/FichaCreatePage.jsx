import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X } from "lucide-react";
import Button from "../../components/shared/Button";
import { es } from "zod/v4/locales";

const FichaCreatePage = () => {
  const navigate = useNavigate();
  const [sindicatos, setSindicatos] = useState([]);
  const [opticas, setOpticas] = useState([]);
  const [delegaciones, setDelegaciones] = useState([]);
  const [armarzones, setArmazones] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [tiposLentes, setTiposLentes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [verificado, setVerificado] = useState(false);

  const formSchema = z.object({
    // Define your form schema here
  });
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: { tipos: "", lentes: [], esTitular: true, esOptica: false },
    resolver: zodResolver(formSchema),
  });
  const { fields, replace } = useFieldArray({
    control,
    name: "lentes",
  });
  const tiposValue = useWatch({
    control,
    name: "tipos",
    defaultValue: "",
  });
  const sendData = () => {
    const data = getValues();
    console.log("Formulario enviado:", JSON.stringify(data, null, 2));
  };
  const getOpticas = async () => {
    const response = await fetch("/api/opticas");
    const data = await response.json();
    setOpticas(data.filter((o) => o.activo));
  };
  const getSindicatos = async () => {
    const response = await fetch("/api/sindicatos");
    const data = await response.json();
    setSindicatos(data.filter((s) => s.activo));
  };
  const getDelegaciones = async () => {
    const response = await fetch("/api/delegaciones");
    const data = await response.json();
    setDelegaciones(data.filter((d) => d.activo));
  };
  const getArmazones = async () => {
    const response = await fetch("/api/armazones");
    const data = await response.json();
    setArmazones(data.filter((a) => a.activo));
  };
  const getLaboratorios = async () => {
    const response = await fetch("/api/laboratorios");
    const data = await response.json();
    setLaboratorios(data.filter((l) => l.activo));
  };
  const getEstados = async () => {
    const response = await fetch("/api/estados");
    const data = await response.json();
    setEstados(data.filter((e) => e.activo));
  };
  const getLentesTipos = async () => {
    const response = await fetch("/api/tipos/lentes");
    const data = await response.json();
    setTiposLentes(data.filter((t) => t.activo));
  };
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        getOpticas(),
        getSindicatos(),
        getDelegaciones(),
        getArmazones(),
        getLaboratorios(),
        getEstados(),
        getLentesTipos(),
      ]);
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (!tiposValue) {
      replace([]);
      return;
    }
    const type = parseInt(tiposValue, 10);
    const tiposMap = {
      1: ["Lejos"],
      2: ["Cerca"],
      3: ["Bifocal"],
      4: ["Lejos", "Cerca"],
      5: ["Lejos", "Cerca"],
    };

    const set = Array.from({ length: tiposMap[type].length }, (_, i) => {
      const tipoIdx = i;
      return {
        tipo: tiposMap[type][tipoIdx] ?? "",
        esfera: "",
        cilindro: "",
        eje: "",
        codArmazon: "",
        colorArmazon: "",
        laboratorio: "",
        typeLente: "",
        voucher: "",
        adicional: "",
        costoAdicional: "",
        codBarra: "",
        estado: estados[0]?.id || "",
        fechaEnvio: "",
        nroPedido: "",
      };
    });
    replace(set);
  }, [tiposValue]);
  return (
    <section className="container mx-auto px-4 py-8 max-w-6xl shadow-lg rounded-lg">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Nueva Ficha</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 ">
          <fieldset className="flex gap-2">
            <label htmlFor="fecha">Fecha Pedido</label>
            <input
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              id="fecha"
              {...register("fecha")}
            />
          </fieldset>
          <fieldset className="flex gap-2">
            <label htmlFor="esOptica">Es de Optica Propia?</label>
            <input type="checkbox" id="esOptica" {...register("esOptica")} />
          </fieldset>
          <fieldset className="flex gap-2">
            <label htmlFor="tipos">Tipos de Lente</label>
            <select
              name="tipos"
              id="tipos"
              defaultValue={""}
              {...register("tipos")}
            >
              <option value="">Seleccionar</option>
              <option value="1">Lejos</option>
              <option value="2">Cerca</option>
              <option value="3">Bifocal</option>
              <option value="4">Lejos y cerca</option>
              <option value="5">Fuera de Prestacion</option>
              {/* Explorar agregar el CRUD */}
            </select>
          </fieldset>
        </div>
        <div className="flex gap-2">
          <Button style="cancel-outline" onClick={() => navigate("/fichas")}>
            <X className="size-4" />
          </Button>
        </div>
      </header>
      <form
        onSubmit={handleSubmit(sendData)}
        className="flex gap-2 flex-col justify-start items-center"
      >
        {/* Form fields go here */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 shadow-lg rounded-lg p-4 w-full">
          <fieldset className="flex flex-col">
            <label htmlFor="sindicato">Sindicato</label>
            <select name="sindicato" id="sindicato" {...register("sindicato")}>
              <option value="">Seleccione el sindicato</option>
              {sindicatos.map((sindicato) => (
                <option key={sindicato.id} value={sindicato.id}>
                  {sindicato.nombre}
                </option>
              ))}
            </select>
          </fieldset>
          <fieldset className="flex flex-col">
            <label htmlFor="delegacion">Delegacion</label>
            <select
              name="delegacion"
              id="delegacion"
              {...register("delegacion")}
            >
              <option value="">Seleccione la delegacion</option>
              {delegaciones.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.provincia} - {d.localidad}
                </option>
              ))}
            </select>
          </fieldset>
          <fieldset className="flex flex-col">
            <label htmlFor="optica">Optica</label>
            <select name="optica" id="optica" {...register("optica")}>
              <option value="">Seleccione la optica</option>
              {opticas.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.nombre}
                </option>
              ))}
            </select>
          </fieldset>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 shadow-lg rounded-lg p-4 w-full">
          <fieldset className="flex flex-col">
            <label htmlFor="voucher">Voucher</label>
            <input
              type="text"
              name="voucher"
              id="voucher"
              {...register("voucher")}
              placeholder="Voucher"
            />
          </fieldset>
          <fieldset className="flex">
            <label htmlFor="lentes">Lentes de Alto Indice / Especiales</label>
            <input
              type="checkbox"
              name="lentesEspeciales"
              id="lentesEspeciales"
              {...register("lentesEspeciales")}
            />
          </fieldset>
          <fieldset className="flex">
            <label htmlFor="lentes">Autorizado sin Voucher</label>
            <input
              type="checkbox"
              name="autorizadoSinVoucher"
              id="autorizadoSinVoucher"
              {...register("autorizadoSinVoucher")}
            />
          </fieldset>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4 shadow-lg rounded-lg p-4 w-full">
          <fieldset className="flex flex-col">
            <label htmlFor="beneficiario">Beneficiario</label>
            <input
              type="text"
              id="beneficiario"
              {...register("beneficiario")}
              placeholder="Nombre Completo del beneficiario"
            />
          </fieldset>
          <fieldset className="flex flex-col">
            <label htmlFor="dniBeneficiario">DNI Beneficiario</label>
            <input
              type="text"
              id="dniBeneficiario"
              {...register("dniBeneficiario")}
              placeholder="DNI del beneficiario"
            />
          </fieldset>
          <fieldset className="flex flex-col">
            <label htmlFor="titular"> Titular</label>
            <input
              type="text"
              id="titular"
              {...register("titular")}
              placeholder="Nombre Completo del Titular"
            />
          </fieldset>
          <fieldset className="flex flex-col">
            <label htmlFor="nroAfiliado">Nro Afiliado</label>
            <input
              type="text"
              id="nroAfiliado"
              {...register("nroAfiliado")}
              placeholder="Número de afiliado"
            />
          </fieldset>
          <button type="button" onClick={() => setVerificado(!verificado)}>
            Validar
          </button>
        </div>
        {watch("dniBeneficiario") &&
          watch("dniBeneficiario").length >= 3 &&
          verificado && (
            <>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4 shadow-lg rounded-lg p-4 w-full"
                >
                  <fieldset className="flex flex-col">
                    <label htmlFor={`lentes[${index}].tipo`}>Tipo</label>
                    <input
                      type="text"
                      id={`lentes[${index}].tipo`}
                      {...register(`lentes.${index}.tipo`)}
                      readOnly
                    />
                  </fieldset>
                  <fieldset className="flex flex-col">
                    <label htmlFor={`lentes[${index}].codArmazon`}>
                      Armazón
                    </label>
                    <input
                      type="text"
                      id={`lentes[${index}].codArmazon`}
                      {...register(`lentes.${index}.codArmazon`)}
                      placeholder="Armazón"
                      list={`armazones-list-${index}`}
                    />
                    <datalist id={`armazones-list-${index}`}>
                      {armarzones.map((a) => (
                        <option
                          key={a.id}
                          value={`${a.codigoInterno}-${a.letraColor}-${a.codigoPatilla}-${a.codigoColor}`}
                        >
                          {a.codigoInterno}-{a.letraColor}-{a.codigoPatilla}-
                          {a.codigoColor}
                        </option>
                      ))}
                    </datalist>
                  </fieldset>
                  <fieldset className="flex flex-col">
                    <label htmlFor={`lentes[${index}].nroPedido`}>
                      Nro Pedido
                    </label>
                    <input
                      type="text"
                      id={`lentes[${index}].nroPedido`}
                      {...register(`lentes.${index}.nroPedido`)}
                      placeholder="Numero de Pedido"
                    />
                  </fieldset>
                  <fieldset className="flex flex-col">
                    <label htmlFor={`lentes[${index}].laboratorio`}>
                      Laboratorio
                    </label>
                    <select
                      id={`lentes[${index}].laboratorio`}
                      {...register(`lentes.${index}.laboratorio`)}
                      defaultValue={""}
                    >
                      <option value="">Seleccione el laboratorio</option>
                      {laboratorios.map((l) => (
                        <option key={l.id} value={l.nombre}>
                          {l.nombre}
                        </option>
                      ))}
                    </select>
                  </fieldset>
                  <fieldset className="flex flex-col">
                    <label htmlFor={`lentes[${index}].esfera`}>
                      Esferico OD
                    </label>
                    <input
                      type="text"
                      id={`lentes[${index}].esfera`}
                      {...register(`lentes.${index}.esfera`)}
                      placeholder=""
                    />
                    <label htmlFor={`lentes[${index}].esfera`}>
                      Esferico OI
                    </label>
                    <input
                      type="text"
                      id={`lentes[${index}].esfera`}
                      {...register(`lentes.${index}.esfera`)}
                      placeholder=""
                    />
                  </fieldset>
                  <fieldset className="flex flex-col">
                    <label htmlFor={`lentes[${index}].cilindro`}>
                      Cilindro OD
                    </label>
                    <input
                      type="text"
                      id={`lentes[${index}].cilindro`}
                      {...register(`lentes.${index}.cilindro`)}
                      placeholder=""
                    />
                    <label htmlFor={`lentes[${index}].cilindro`}>
                      Cilindro OI
                    </label>
                    <input
                      type="text"
                      id={`lentes[${index}].cilindro`}
                      {...register(`lentes.${index}.cilindro`)}
                      placeholder=""
                    />
                  </fieldset>
                  <fieldset className="flex flex-col">
                    <label htmlFor={`lentes[${index}].eje`}>Eje OD</label>
                    <input
                      type="text"
                      id={`lentes[${index}].eje`}
                      {...register(`lentes.${index}.eje`)}
                      placeholder=""
                    />
                    <label htmlFor={`lentes[${index}].eje`}>Eje OI</label>
                    <input
                      type="text"
                      id={`lentes[${index}].eje`}
                      {...register(`lentes.${index}.eje`)}
                      placeholder=""
                    />
                  </fieldset>
                  <fieldset className="flex flex-col">
                    <label htmlFor={`lentes[${index}].typeLente`}>
                      Tipo de Lente
                    </label>
                    <select
                      id={`lentes[${index}].typeLente`}
                      {...register(`lentes.${index}.typeLente`)}
                      defaultValue={""}
                    >
                      <option value="">Seleccione el tipo de lente</option>
                      {tiposLentes.map((t) => (
                        <option key={t.id} value={t.nombre}>
                          {t.nombre}
                        </option>
                      ))}
                    </select>
                  </fieldset>
                  <fieldset className="flex flex-col">
                    <label htmlFor={`lentes[${index}].estado`}>Estado</label>
                    <select
                      id={`lentes[${index}].estado`}
                      {...register(`lentes.${index}.estado`)}
                      defaultValue={estados[0]?.id || ""}
                    >
                      {estados.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.nombre}
                        </option>
                      ))}
                    </select>
                  </fieldset>
                  <fieldset className="flex flex-col">
                    <label htmlFor={`lentes[${index}].adicional`}>
                      Adicional
                    </label>
                    <input
                      type="text"
                      id={`lentes[${index}].adicional`}
                      {...register(`lentes.${index}.adicional`)}
                      placeholder="Adicional"
                    />
                  </fieldset>
                  <fieldset className="flex flex-col">
                    <label htmlFor={`lentes[${index}].costoAdicional`}>
                      Costo Adicional
                    </label>
                    <input
                      type="text"
                      id={`lentes[${index}].costoAdicional`}
                      {...register(`lentes.${index}.costoAdicional`)}
                      placeholder="Costo Adicional"
                    />
                  </fieldset>
                  <fieldset className="flex flex-col">
                    <label htmlFor={`lentes[${index}].codBarra`}>
                      Cód Barra
                    </label>
                    <input
                      type="text"
                      id={`lentes[${index}].codBarra`}
                      {...register(`lentes.${index}.codBarra`)}
                      placeholder="Cód Barra"
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <label htmlFor={`lentes[${index}].fechaEnvio`}>
                      Fecha de Envio
                    </label>
                    <input
                      type="date"
                      id={`lentes[${index}].fechaEntrega`}
                      {...register(`lentes.${index}.fechaEnvio`)}
                      disabled={
                        watch(`lentes.${index}.estado`) ===
                        estados.find((e) => e.nombre == "Pasado")?.id
                      }
                    />
                  </fieldset>
                </div>
              ))}
            </>
          )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 shadow-lg rounded-lg p-4 w-full">
          <fieldset className="flex flex-col col-span-4">
            <label htmlFor="comentario">Comentario</label>
            <textarea
              id="comentario"
              {...register("comentario")}
              placeholder="Comentario"
            />
          </fieldset>
          {watch("esOptica") && (
            <>
              <fieldset className="flex flex-col">
                <label htmlFor="seña">Seña</label>
                <input
                  type="text"
                  id="seña"
                  {...register("seña")}
                  placeholder="Seña"
                />
              </fieldset>
              <fieldset className="flex flex-col">
                <label htmlFor="saldo">Saldo</label>
                <input
                  type="text"
                  id="saldo"
                  {...register("saldo")}
                  placeholder="Saldo Adicional"
                />
              </fieldset>
              <fieldset className="flex flex-col">
                <label htmlFor="telefono">Telefono</label>
                <input
                  type="text"
                  id="telefono"
                  {...register("telefono")}
                  placeholder="telefono"
                />
              </fieldset>
            </>
          )}
        </div>
        <button
          type="submit"
          className="text-slate-50 bg-slate-500 hover:bg-slate-700 border-none focus:border-none rounded-md inline-flex items-center justify-center p-2 outline-none focus:outline-none ring-0 focus:ring-0 transition-colors cursor-pointer"
        >
          Crear Ficha
        </button>
      </form>
    </section>
  );
};

export default FichaCreatePage;
