import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TablesService } from 'src/services/tables.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateTableComponent } from '../../create-table/create-table.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'number', 'capacity', 'availability', 'actions'];
  dataSource: MatTableDataSource<{ id: number, number: number, capacity: number, availability: boolean }> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private tablesService: TablesService, private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.loadTables();
  }

  loadTables(): void {
    this.tablesService.getAllTables().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => console.error('Error loading tables:', err)
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateTableComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTables();
      }
    });
  }

  openEditDialog(table: { id: number, number: number, capacity: number, availability: boolean }): void {
    const dialogRef = this.dialog.open(CreateTableComponent, {
      width: '400px',
      data: table
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTables();
      }
    });
  }

  deleteTable(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this table?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tablesService.deleteTable(id).subscribe({
          next: () => this.loadTables(),
          error: (err) => console.error('Error deleting table:', err)
        });
      }
    });
  }
}