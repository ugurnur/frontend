package navigation

import NavLinks2._
import Pillars._

object NewsSections extends EditionalisedNavList {
  lazy val au = List(australiaNews, world, auPolitics, environment, indigenousAustralia, auImmigration, media)
  lazy val uk = List(ukNews, world, business, environment, tech, politics, science, globalDevelopment, cities, obituaries)
  lazy val us = List(usNews, world, environment, usPolitics, business, science, money, tech, obituaries)
  lazy val int = List(world, ukNews, science, cities, globalDevelopment, tech, business, environment, obituaries)
}

object OpinionSections extends EditionalisedNavList {
  lazy val uk = List(
    theGuardianView,
    columnists,
    cartoons,
    inMyOpinion,
    letters,
    NavLink2("", "/profile/pollytoynbee", "Polly Toynbee", opinionPillar, None),
    NavLink2("", "/profile/owen-jones", "Owen Jones", opinionPillar, None),
    NavLink2("", "/profile/jonathanfreedland", "Jonathan Freedland", opinionPillar, None),
    NavLink2("", "/profile/marinahyde", "Marina Hyde", opinionPillar, None)
  )
  lazy val au = List(
    auColumnists,
    cartoons,
    indigenousAustraliaOpinion,
    theGuardianView.copy(title="editorials"),
    letters,
    NavLink2("", "/profile/first-dog-on-the-moon", "first dog on the moon", opinionPillar, None),
    NavLink2("", "/profile/katharine-murphy", "Katharine Murphy", opinionPillar, None)
  )
  lazy val us = List(
    theGuardianView,
    columnists,
    letters,
    NavLink2("", "/profile/jill-abramson", "Jill Abramson", opinionPillar, None),
    NavLink2("", "/commentisfree/series/jessica-valenti-column", "Jessica Valenti", opinionPillar, None),
    NavLink2("", "/profile/steven-w-thrasher", "Steven W Thrasher", opinionPillar, None),
    NavLink2("", "/profile/richard-wolffe", "Richard Wolffe", opinionPillar, None),
    inMyOpinion,
    cartoons
  )
  lazy val int = List(
    theGuardianView,
    columnists,
    cartoons,
    inMyOpinion,
    letters
  )
}

object SportSections extends EditionalisedNavList {
  lazy val uk = List(football, rugbyUnion, cricket, tennis, cycling, formulaOne, rugbyLeague, racing, usSports, golf)
  lazy val au = List(football, AFL, NRL, aLeague, cricket, rugbyUnion, tennis)
  lazy val us = List(soccer, NFL, tennis, MLB, MLS, NBA, NHL)
  lazy val int = List(football, rugbyUnion, cricket, tennis, cycling, formulaOne, golf, usSports)
}

object ArtsSections extends EditionalisedNavList {
  lazy val uk = List(tvAndRadio, music, film, stage, books, games, artAndDesign, classical)
  lazy val au = List(film, music, books, tvAndRadio, artAndDesign, stage, games, classical)
  lazy val us = List(film, books, music, artAndDesign, tvAndRadio, stage, classical, games)
  lazy val int = List(books, music, tvAndRadio, artAndDesign, film,games, classical, stage)
}

object LifeSections extends EditionalisedNavList {
  lazy val uk = List(fashion, food, recipes, travel, loveAndSex, family, home, health, women, money)
  lazy val au = List(travel, foodAu, relationshipsAu, fashionAu, healthAu, loveAndSex, family, home)
  lazy val us = List(fashion, food, recipes, loveAndSex, home, health, family, travel, money)
  lazy val int = List(fashion, food, recipes, loveAndSex, health, home, women, family, travel, money)
}

object NetworkFrontSections extends EditionalisedNavList {
  lazy val uk = List(ukNews, world, business, environment, tech, football)
  lazy val au = List(australiaNews, world, auPolitics, environment, football)
  lazy val us = List(usNews, world, usPolitics, business, environment, soccer)
  lazy val int = List(world, ukNews, business, science, globalDevelopment, football)
}


object UkNewsSubnav extends EditionalisedNavList {
  lazy val uk = List(politics, education, media, society, law, scotland, wales, northernIreland)
  lazy val au = uk
  lazy val us = uk
  lazy val int = uk
}

object WorldSubnav extends EditionalisedNavList {
  lazy val uk = List(europe, usNews, americas, asia, australiaNews, middleEast, africa, inequality, cities, globalDevelopment)
  lazy val au = uk
  lazy val us = uk
  lazy val int = uk
}

object MoneySubnav extends EditionalisedNavList {
  lazy val uk = List(property, pensions, savings, borrowing, careers)
  lazy val au = uk
  lazy val us = uk
  lazy val int = uk
}

object FootballSubnav extends EditionalisedNavList {
  lazy val uk = List(
    NavLink2("live scores", "/football/live", "football/live", football, None),
    NavLink2("tables", "/football/tables", "football/tables", football, None),
    NavLink2("competitions", "/football/competitions", "football/competitions", football, None),
    NavLink2("results", "/football/results", "football/results", football, None),
    NavLink2("fixtures", "/football/fixtures", "football/fixtures", football, None),
    NavLink2("clubs", "/football/teams", "football/teams", football, None)
  )
  lazy val au = uk
  lazy val us = uk
  lazy val int = uk
}

object TodaysPaperSubnav extends EditionalisedNavList {
  lazy val uk = List(
    NavLink2("tone/obituaries", "/tone/obituaries", "obituaries", todaysPaper, None),
    NavLink2("", "/theguardian/g2", "g2", todaysPaper, None),
    NavLink2("", "/theguardian/weekend", "weekend", todaysPaper, None),
    NavLink2("", "/theguardian/theguide", "the guide", todaysPaper, None),
    NavLink2("", "/theguardian/guardianreview", "saturday review", todaysPaper, None)
  )
  lazy val au = uk
  lazy val us = uk
  lazy val int = uk
}

object ObserverSubnav extends EditionalisedNavList {
  lazy val uk = List(
    NavLink2("", "/theobserver/news/comment", "comment", observer, None),
    NavLink2("", "/theobserver/new-review", "the new review", observer, None),
    NavLink2("", "/theobserver/magazine", "observer magazine", observer, None)
  )
  lazy val au = uk
  lazy val us = uk
  lazy val int = uk
}

object CrosswordsSubnav extends EditionalisedNavList {
  lazy val uk = List(
    NavLink2("", "/crosswords/crossword-blog", "blog", crosswords, None),
    NavLink2("", "/crosswords/series/crossword-editor-update", "editor", crosswords, None),
    NavLink2("", "/crosswords/series/quick", "quick", crosswords, None),
    NavLink2("", "/crosswords/series/cryptic", "cryptic", crosswords, None),
    NavLink2("", "/crosswords/series/prize", "prize", crosswords, None),
    NavLink2("", "/crosswords/series/weekend-crossword", "weekend", crosswords, None),
    NavLink2("", "/crosswords/series/quiptic", "quiptic", crosswords, None),
    NavLink2("", "/crosswords/series/genius", "genius", crosswords, None),
    NavLink2("", "/crosswords/series/speedy", "speedy", crosswords, None),
    NavLink2("", "/crosswords/series/everyman", "everyman", crosswords, None),
    NavLink2("", "/crosswords/series/azed", "azed", crosswords, None)
  )
  lazy val au = uk
  lazy val us = uk
  lazy val int = uk
}

object BusinessSubnav extends EditionalisedNavList {
  lazy val uk = List(economics, banking, money, markets, eurozone)
  lazy val us = List(economics, sustainableBusiness, diversityEquality, smallBusiness)
  lazy val au = List(markets, money)
  lazy val int = uk
}

object EnvironmentSubnav extends EditionalisedNavList {
  lazy val uk = List(climateChange, wildlife, energy, pollution)
  lazy val us = uk
  lazy val au = List(cities, globalDevelopment, sustainableBusiness)
  lazy val int = uk
}

object TravelSubnav extends EditionalisedNavList {
  lazy val uk = List(travelUk, travelEurope, travelUs)
  lazy val us = List(travelUs, travelEurope, travelUk)
  lazy val au = List(travelAustralasia, travelAsia, travelUk, travelEurope, travelUs)
  lazy val int = uk
}
