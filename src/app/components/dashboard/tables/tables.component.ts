import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TablesService } from 'src/services/tables.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateTableComponent } from '../../create-table/create-table.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

interface Table {
  id: number;
  number: number;
  capacity: number;
  availability: boolean;
}

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'number', 'capacity', 'availability', 'actions'];
  dataSource: MatTableDataSource<Table> = new MatTableDataSource<Table>();
  isLoading: boolean = true;
  searchValue: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private tablesService: TablesService, 
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTables();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadTables(): void {
    this.isLoading = true;
    this.tablesService.getAllTables().subscribe({
      next: (data: Table[]) => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading tables:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchValue = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearSearch(): void {
    this.searchValue = '';
    this.dataSource.filter = '';
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateTableComponent, {
      width: '450px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadTables();
      }
    });
  }

  openEditDialog(table: Table): void {
    const dialogRef = this.dialog.open(CreateTableComponent, {
      width: '450px',
      panelClass: 'custom-dialog-container',
      data: { ...table }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadTables();
      }
    });
  }

  deleteTable(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { 
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this table?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.isLoading = true;
        this.tablesService.deleteTable(id).subscribe({
          next: () => {
            this.loadTables();
          },
          error: (err: any) => {
            console.error('Error deleting table:', err);
            this.isLoading = false;
          }
        });
      }
    });
  }
}