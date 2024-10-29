import { Component } from '@angular/core';
import { SidevarComponent } from "../sidevar/sidevar.component";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Carrera } from '../../models/carrera';
import { Facultad } from '../../models/facultad';
import { CarreraService } from '../../services/carrera.service';
import { FacultadService } from '../../services/facultad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carrera',
  standalone: true,
  imports: [SidevarComponent, NgFor,FormsModule,NgIf,ReactiveFormsModule],
  templateUrl: './carrera.component.html',
  styleUrl: './carrera.component.css'
})
export class CarreraComponent {
  carreras: Carrera[] = [];
  facultades: Facultad[] = [];
  isUpdate: boolean = false;
  formCarrera: FormGroup = new FormGroup({});
  mostrarTabla: boolean = true;

  cambiarVista(){
    this.mostrarTabla = !this.mostrarTabla;
  }

  constructor(
    private carreraService: CarreraService,
    private facultadService: FacultadService
  ){}

  ngOnInit():void{
    this.listarCarreras();
    this.listarFacultades();
    this.formCarrera = new FormGroup({
      id_carrera: new FormControl(''),
      nombre: new FormControl(''),
      estado: new FormControl(''),
      facultad:new FormControl('')
    });
  }

  listarCarreras(): void {
    this.carreraService.getCarreras().subscribe(
      (data: Carrera[]) => {
        this.carreras = data;
      },
      (error) => {
        console.error('Error al buscar carreras', error);
      }
    );
  }

  listarFacultades(): void {
    this.facultadService.getFacultades().subscribe(
      (data: Facultad[]) => {
        this.facultades = data;
      },
      (error) => {
        console.error('Error al obtener las secciones', error);
      }
    );
  }

  crearCarrera() {
    const nuevacarrera = {
      id_carrera: this.formCarrera.value.id_carrera,
      nombre: this.formCarrera.value.nombre,
      estado: this.formCarrera.value.estado,
      facultad: { id_facultad: this.formCarrera.value.id_facultad } as any
    } as any;
    this.carreraService.crearCarrera(nuevacarrera).subscribe({
      next: (resp) => {
        if (resp) {
          Swal.fire({
            icon: 'success',
            title: 'Libro creado',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
          this.listarCarreras();
          this.formCarrera.reset();
        }
      },
      error: (err) => {
        console.error('Error creando Carrera', err);
      }
    });
  }

  resetFormCarrera(){
    this.formCarrera.reset();
  }

  selectCarrera(carrera: any) {
    this.isUpdate = true;
    this.formCarrera.controls['idLibro'].setValue(carrera.id_carrera);
    this.formCarrera.controls['titulo'].setValue(carrera.nombre);
    this.formCarrera.controls['paginas'].setValue(carrera.estado);
    this.formCarrera.controls['idSeccion'].setValue(carrera.facultad.id_facultad);
  }

  actualizarCarrera() {
    const nuevacarrera = {
      id_carrera: this.formCarrera.value.idLibro,
      nombre: this.formCarrera.value.titulo,
      estado: this.formCarrera.value.paginas,
      facultad: { id_facultad: this.formCarrera.value.id_facultad } as any
    } as any;
    this.carreraService.actualizarCarrera(nuevacarrera).subscribe({
      next: (resp) => {
        if (resp) {
          Swal.fire({
            icon: 'success',
            title: 'Libro actualizado',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
          this.listarCarreras();
          this.formCarrera.reset();
        }
      },
      error: (err) => {
        console.error('Error AL ACTUALIZAR', err);
      }
    });
  }

  eliminarCarrera(id_carrera: any){
    Swal.fire({
      title: "¿Estás seguro de borrar la carrera?",
      text: "¡No serás capaz de reveritrlo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#19e212",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, borralo!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "¡Borrado!",
          text: "El dato ha sido borrado",
          icon: "success"
        });
        this.carreraService.deleteCarrera(id_carrera).subscribe(resp=>{this.listarCarreras();});
      }
    });
  }

}