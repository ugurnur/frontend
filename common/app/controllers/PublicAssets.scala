package controllers

import model.NoCache
import play.api.mvc.{AnyContent, BaseController}

trait PublicAssets extends BaseController with AssetsComponents {
  def at(file: String, relativePath: String = ""): NoCache[AnyContent] = model.NoCache {
    assets.at("/public", relativePath + file)
  }
}
