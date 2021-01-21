import yaml
import stringcase

airtable_keys = {
    "Northern California": "shrPgYCd4mlJhopzE",
    "SF Bay Area": "shrcC9IJ8ezCYAs9I",
    "Greater Sacramento": "shrdT6V38E6k1bwxu",
    "San Joaquin Valley": "shrrPf4SKn0SGsuzU",
    "Southern California": "shry7inpTCe0dBlZk",
}

with open("./_data/regions_counties.yml") as file:
    counties_list = yaml.load(file, Loader=yaml.FullLoader)

    for region in counties_list:
        for county in counties_list[region]:
            filename = stringcase.snakecase(county.lower())
            with open(f"./_counties/{filename}.md", "w+") as county_file:
                county_file.writelines(
                    (
                        "---\n",
                        "layout: county\n",
                        f"title: {county}\n",
                        f"region: {region}\n",
                        f"region_airtable: {airtable_keys[region]}\n",
                        "---\n",
                    )
                )
