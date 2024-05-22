import { Component } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DatosFormulario, ProductoSeleccionado } from './datosFormulario';
import { EnviarDatosFormularioBackService } from '../enviar-datos-formulario-back.service';
import { GenerarPdfServiceService } from '../generar-pdf-service.service';


@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})

export class FormularioComponent {

  productosDisponibles: String[] = ['Cheetos', 'Papitas', 'Golpe', 'Margarita', 'Choclitos', 'Palitos', 'Zucaritas', 'Achiras', 'DeTodito', 'Natuchips', 'Doritos', 'FritoLay'];
  productosSeleccionados: ProductoSeleccionado[] = [];
  datosFormulario: DatosFormulario = new DatosFormulario();
  nombrePdf: string = '';

  constructor(private formBuilder: FormBuilder, private enviarDatosFormularioBackService: EnviarDatosFormularioBackService, private generarPdfService: GenerarPdfServiceService) { }

  form = this.formBuilder.group({
    'nombre': ['', Validators.required],
    'numeroDocumento': ['', [Validators.required]],
    'telefono': ['', [Validators.required]],
    'productos': ['', [Validators.required]],
    'cantidad': [1, [Validators.required]]
  });


  agregarProducto(producto: string) {

    const cantidadControl = this.form.get('cantidad');
    if (cantidadControl && cantidadControl.valid) {
      const cantidad = cantidadControl.value as number;
      if (cantidad > 0) {
        const productoExistente = this.productosSeleccionados.find(p => p.nombre === producto);
        if (productoExistente) {
          alert(`El producto "${producto}" ya ha sido agregado.`);
        } else {
          this.productosSeleccionados.push({ nombre: producto, cantidad: cantidad });
        }
      } else {
        alert('La cantidad debe ser mayor que 0.');
      }
    }
  }


  eliminarProducto(index: number) {
    this.productosSeleccionados.splice(index, 1);
  }

  marcarComoTocado() {
    const numeroDocumentoControl = this.form.get('numeroDocumento');
    if (numeroDocumentoControl) {
      numeroDocumentoControl.markAsTouched();
    }
  }

  marcarComoTocadoTelefono() {
    const telefonoControl = this.form.get('telefono');
    if (telefonoControl) {
      telefonoControl.markAsTouched();
    }
  }


  guardarDatosFormulario() {
    this.datosFormulario.nombre = this.form.get('nombre')?.value || '';
    this.datosFormulario.numeroDocumento = this.form.get('numeroDocumento')?.value || '';
    this.datosFormulario.telefono = this.form.get('telefono')?.value || '';
    this.datosFormulario.productoSeleccionados = this.productosSeleccionados.map(p => ({ nombre: p.nombre, cantidad: p.cantidad }));
    this.nombrePdf = this.datosFormulario.nombre;

    console.log('Datos a enviar al backend:', this.datosFormulario);

    this.enviarDatosFormularioBackService.enviarFormulario(this.datosFormulario).subscribe({
      next: (response) => {
        alert('Formulario enviado exitosamente, presiona OK para descargar el PDF');
        this.crearPdf();
      },
      error: (error) => {
        alert('Error al enviar el formulario');
      },
      complete: () => {
        console.log('Proceso de envío completado');
      }
    });

    this.generarPdfService.generarPdf();
    this.form.reset();
    this.productosSeleccionados = [];
    this.form.get('cantidad')?.setValue(1);
  }


  crearPdf() {
    this.generarPdfService.generarPdf().subscribe((response: any) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      this.nombrePdf = this.nombrePdf.replace(/\s/g, "");
      link.download = 'OrdenCompra _' + this.nombrePdf + '.pdf';

      link.click();

      window.URL.revokeObjectURL(url);
    });
  }

  
  get nombre() {
    return this.form.get('nombre') as FormControl;
  }

  get numeroDocumento() {
    return this.form.get('numeroDocumento') as FormControl;
  }

  get telefono() {
    return this.form.get('telefono') as FormControl;
  }

  get productos() {
    return this.form.get('productos') as FormControl;
  }

}
