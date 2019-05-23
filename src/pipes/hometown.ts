import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "hometownFilter"
})
export class HometownPipe implements PipeTransform {
  transform(hometowns: any[], search: string): any {
    if (!hometowns) {
      return;
    } else if (!search) {
      return hometowns;
    } else {
      let term = search.toLowerCase();
      return hometowns.filter(
        hometown => hometown.description.toLowerCase().indexOf(term) > -1
      );
    }
  }
}
