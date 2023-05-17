import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ProposalService } from 'src/app/service/proposal/proposal.service';
// import { CalculationDataService } from 'src/app/service/Calculate Data/calculation-data.service';
import { CostService } from 'src/app/service/cost/cost.service';
export interface DialogData {
  center: any
}
@Component({
  selector: 'app-show-stats',
  templateUrl: './show-stats.component.html',
  styleUrls: ['./show-stats.component.scss']
})

export class ShowStatsComponent implements OnInit {
  rentAndCamTotal:any;
  bookingPriceUptilNow:any;
  rent:any;
  cam:any;
  currentValue:any;
  rackValue:any;
  centerName:any;
  totalNumber:any;
  totalCost:any;
  selectedNumber:any;
  currentCostOfSelectedSeats:any;
  standarCost:any
  profitLoss:any;
  currentSeatPrice:any;
  constructor(
    private proposalService: ProposalService,
    private costService: CostService,
    public dialogRef: MatDialogRef<ShowStatsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

getCostSheetValue(){

}

  ngOnInit(): void {
this.getCostSheetValue()
    console.log(this.data.center,"on open")
    let data=this.data.center
    this.centerName = data.name;
    this.bookingPriceUptilNow = new Intl.NumberFormat('en-IN', { currency: 'INR' }).format(data.bookingPriceUptilNow);
    let bookedPrice = data.bookingPriceUptilNow;
    this.totalNumber = data.totalNoOfWorkstation;
    this.selectedNumber = data.selectedNoOfSeats;
    this.rentAndCamTotal = data.rentAndCamTotal;
    // this.rackValue = new Intl.NumberFormat('en-IN', { currency: 'INR' }).format(data.rackRate);
    // let rackvalue = data.rackRate;
    this.costService.getAllCosts().subscribe((res:any)=>{
      // console.log(res)
      // this.standarCost= ;\
      let years3Rent =(res[0].costStandardInteriors/36)*1.12;
      let total_1 = years3Rent + res[0].costOfElectricity + res[0].costOfOPS + this.rentAndCamTotal;
      let adminMarketing = total_1*0.05;
      let brokerage = total_1*0.07;
      let total_2 = total_1 + adminMarketing + brokerage;
      let profitBeforeTax = total_2*0.5;
      let total_3 = total_2 + profitBeforeTax;
      let rateOfInventoryOnLeaseArea = (22/0.7)*total_3;
      let includeCommonsAmeneities = rateOfInventoryOnLeaseArea * 1.1;
      let on80perDiversityFactor = includeCommonsAmeneities/0.8;
      this.currentValue = new Intl.NumberFormat('en-IN', { currency: 'INR' }).format(Math.round(on80perDiversityFactor)) ;

      let rackNewValue = (Math.ceil(on80perDiversityFactor/1000)*1000) +1000;
      this.rackValue = rackNewValue;
    // let standarCost = 2000.00;
    const totalSeats = this.totalNumber;
    const seatCost = rackNewValue;
    const totalSellingPrice = bookedPrice;
    const seatsSoldTotal = this.selectedNumber;

    //calculate per seat cost after selling
    const perSeatPriceAfterSell = Math.round(totalSellingPrice / seatsSoldTotal);
    console.log(perSeatPriceAfterSell,"per seat");
      this.currentSeatPrice = new Intl.NumberFormat('en-IN', { currency: 'INR' }).format(perSeatPriceAfterSell);
    //calculate the profit loss
    const profitOrLoss = perSeatPriceAfterSell - seatCost;
    console.log("Profit - Loss",profitOrLoss);
      this.profitLoss = new Intl.NumberFormat('en-IN', { currency: 'INR' }).format(profitOrLoss);
    // Calculate cost
    // const cost = totalSeats * seatCost;

    // Calculate revenue per seat
    // const revenuePerSeat = totalSellingPrice / totalSeats;

    // Calculate revenue based on seats sold
    // const seatsSold = Math.floor(totalSellingPrice / revenuePerSeat);
    // const revenue = seatsSold * revenuePerSeat;

    // Calculate profit or loss
    // const profitLoss = revenue - cost;

    // console.log('Revenue:', revenue);
    // console.log('Cost:', cost);
    // console.log('Profit/Loss:', profitLoss);

});
  }

}
