export class DatosFormulario {
    nombre: string;
    numeroDocumento: string;
    telefono: string;
    productoSeleccionados: ProductoSeleccionado[];

    constructor() {
        this.nombre = '';
        this.numeroDocumento = '';
        this.telefono = '';
        this.productoSeleccionados = [];
    }
}

export interface ProductoSeleccionado {
    nombre: string;
    cantidad: number;
}
