import yaml
import stringcase

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
                        "---\n",
                    )
                )
