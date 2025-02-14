import json
import os
import sys
from datetime import datetime
import argparse
from typing import List, Optional

chump_file_path = '../src/data/chumps.json'
calc_fields = ["date_aus_string", "date_year", "date_week"]

class Chump:
    def __init__(self, name: str, url: str):
        self.name = name
        self.url = url

    def to_dict(self):
        return {"name": self.name, "url": self.url}

    @classmethod
    def from_dict(cls, data):
        return cls(name=data["name"], url=data["url"])

class Bout:
    def __init__(self, date: str, thanks: str, chumps: List[Chump], image: str = "", thumb: str = ""):
        self.date = date
        self.thanks = thanks
        self.streak = None
        self.chumps = chumps
        self.image = image
        self.thumb = thumb
        self._parsed_date = datetime.strptime(self.date, "%Y-%m-%d")
        # set image and thumb if not set
        if not self.image:
            self.image = f"/images/{self.date}.png"
        if not self.thumb:
            self.thumb = f"/images/thumbs/{self.date}.png"

    @property
    def date_year(self) -> int:
        return int(self._parsed_date.strftime("%Y"))

    @property
    def date_week(self) -> int:
        return int(self._parsed_date.strftime("%W"))
    
    @property
    def date_aus_string(self) -> str:
        return self._parsed_date.strftime("%d/%m/%Y")

    def to_dict(self):
        return {
            "date": self.date,
            "thanks": self.thanks,
            "streak": self.streak,
            "chumps": [chump.to_dict() for chump in self.chumps],
            "image": self.image,
            "thumb": self.thumb,
            "date_year": self.date_year,
            "date_week": self.date_week,
            "date_aus_string": self.date_aus_string
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            date=data["date"],
            thanks=data["thanks"],
            chumps=[Chump.from_dict(chump) for chump in data["chumps"]],
            image=data.get("image", ""),
            thumb=data.get("thumb", "")
        )

class OutputFile:
    def __init__(self, bouts: Optional[List[Bout]] = None):
        self.bouts = bouts if bouts is not None else []

    def sort_bouts(self):
        self.bouts.sort(key=lambda x: x.date, reverse=True)

    def add_bout(self, bout: Bout):
        self.bouts.append(bout)
        self.sort_bouts()
        self.recalculate_streaks()

    def recalculate_streaks(self):
        for i in range(len(self.bouts) - 1):
            if i == 0 or i == len(self.bouts) - 1:
                self.bouts[i].streak = 1
            else:
                self.bouts[i].streak = (datetime.strptime(self.bouts[i - 1].date, "%Y-%m-%d") - datetime.strptime(self.bouts[i].date, "%Y-%m-%d")).days

    def to_dict(self):
        return [bout.to_dict() for bout in self.bouts]

    @classmethod
    def from_dict(cls, data):
        return cls(bouts=[Bout.from_dict(bout) for bout in data])

def load_from_json_file(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
        file = OutputFile.from_dict(data)
        file.recalculate_streaks()
        return file

def save_to_json_file(my_bouts, file_path):
    with open(file_path, 'w') as file:
        export_dict = my_bouts.to_dict()
        json.dump(export_dict, file, indent=4)

# Read date from command line
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--new", help="add the chump via arguments. Exclude to use stdin", action='store_true')
    parser.add_argument("--recalc", help="Recalc the streaks", action='store_true')
    parser.add_argument("--date", help="Date of the chump in YYYY-MM-DD format")
    parser.add_argument("--name", help="Name of the chump")
    parser.add_argument("--url", help="URL of the chump")
    parser.add_argument("--thanks", help="Thanks message")

    args = parser.parse_args()
    
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
    print(my_bouts.to_dict())

    # Save to file
    save_to_json_file(my_bouts, f"{chump_file_path}")

    print("Done! 🎉 <3")