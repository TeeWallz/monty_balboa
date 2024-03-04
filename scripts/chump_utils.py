import json
import os
import sys
from dataclasses import dataclass, field
from pydantic import BaseModel, PositiveInt, computed_field, model_serializer
from datetime import datetime
import argparse
from typing import List

chump_file_path = '../src/data/chumps.json'
calc_fields = ["date_aus_string", "date_year", "date_week"]

class Chump(BaseModel):
    name: str
    url: str

class Bout(BaseModel):
    date: str
    thanks: str
    streak: int = None
    chumps: List[Chump]
    image: str
    thumb: str
    _parsed_date: datetime = None

    def __init__(self, **data):
        super().__init__(**data)
        self._parsed_date = datetime.strptime(self.date, "%Y-%m-%d")
        # set image and thumb if not set
        if not self.image:
            self.image = f"/images/{self.date}.png"
        if not self.thumb:
            self.thumb = f"/images/thumbs/{self.date}.png"

    @computed_field
    @property
    def date_year(self) -> int:
        return int(self._parsed_date.strftime("%Y"))

    @computed_field
    @property
    def date_week(self) -> int:
        # cast to int to remove leading 0
        return int(self._parsed_date.strftime("%W"))
    
    @computed_field
    @property
    def date_aus_string(self) -> str:
        return self._parsed_date.strftime("%d/%m/%Y")

class OutputFile(BaseModel):
    bouts: List[Bout] = field(default_factory=list)

    def sort_bouts(self):
        self.bouts.sort(key=lambda x: x.date, reverse=True)

    def add_bout(self, bout: Bout):
        self.bouts.append(bout)
        self.sort_bouts()
        self.recalculate_streaks()

    def recalculate_streaks(self):
        # compare each date to the next date and set streak as the difference
        # between the two dates
        for i in range(len(self.bouts) - 1):
            if i == 0 or i == len(self.bouts) - 1:
                # set the first streak to 1
                self.bouts[i].streak = 1
            else:
                self.bouts[i].streak = (datetime.strptime(self.bouts[i - 1].date, "%Y-%m-%d") - datetime.strptime(self.bouts[i].date, "%Y-%m-%d")).days

def load_from_json_file(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
        # return using OutputFile model
        file = OutputFile(bouts=data)
        file.recalculate_streaks()
        return file

def save_to_json_file(my_bouts, file_path):
    with open(file_path, 'w') as file:
        export_dict = my_bouts.model_dump()['bouts']
        json.dump(export_dict, file, indent=4)


# Read date from command line
if __name__ == "__main__":
    # Check if there are named arguments --name, --url
    parser=argparse.ArgumentParser()
    parser.add_argument("--new", help="add the chump via arguments. Exclude to use stdin", action='store_true')
    parser.add_argument("--recalc", help="Recalc the streaks", action='store_true')
    parser.add_argument("--date", help="Date of the chump in YYYY-MM-DD format")
    parser.add_argument("--name", help="Name of the chump")
    parser.add_argument("--url", help="URL of the chump")
    parser.add_argument("--thanks", help="Thanks message")

    args=parser.parse_args()
    
    date = None
    name = None
    url = None
    thanks = None

    # cd to scripts directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    my_bouts = load_from_json_file(chump_file_path)

    if args.recalc:
        my_bouts.recalculate_streaks()
        save_to_json_file(my_bouts, f"{chump_file_path}")
        sys.exit(0)
    elif args.new:
        required_args = ["date", "name", "url", "thanks"]
        for arg in required_args:
            if not getattr(args, arg):
                print(f"Missing argument: {arg}")
                sys.exit(1)

        date = args.date
        name = args.name
        url = args.url
        thanks = args.thanks
        my_bouts.add_bout(Bout(date=date, thanks=thanks, chumps=[Chump(name=name, url=url)], image="", thumb=""))
    
    else:
        # Read date from stdin
        print("Enter date in YYYY-MM-DD format: ", end="")
        date = input()

        print("Enter thanks message: ", end="")
        thanks = input()

        print("Enter url: ", end="")
        url = input()

        print("Enter name: ", end="")
        name = input()
        my_bouts.add_bout(Bout(date=date, thanks=thanks, chumps=[Chump(name=name, url=url)], image="", thumb=""))


    # Add new data to my_bouts
    print(my_bouts)

    # Save to file
    save_to_json_file(my_bouts, f"{chump_file_path}")

    print("Done! 🎉 <3")
