package navigation

import common.Edition
import common.editions

trait NavItem {
  val id: String
  val url: String
  val title: String
  val children: Option[EditionalisedNavList]
}

case class Pillar (
 id: String,
 url: String,
 title: String,
 longDisplayName: String,
 children: EditionalisedNavList
) extends NavItem

case class NavLink2(
 id: String,
 url: String,
 title: String,
 parent: NavItem,
 children: Option[EditionalisedNavList]
) extends NavItem

trait EditionalisedNavList {
  val uk: List[NavLink2]
  val au: List[NavLink2]
  val us: List[NavLink2]
  val int: List[NavLink2]

  def getEditionalisedList(edition: Edition): List[NavLink2] = edition match {
    case editions.Uk => uk
    case editions.Au => au
    case editions.Us => us
    case editions.International => int
  }
}
