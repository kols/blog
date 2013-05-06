DEPLOY_DIR = "_deploy"
GEN_CONTENT_DIR = "_site"
GITHUB_REPO = "git@github.com:kols/blog.git"
GH_PAGES_BRANCH = "gh-pages"

desc "Generate the site"
task :generate do |t, args|
  rm_rf "#{GEN_CONTENT_DIR}"
  cd "compass" do
    sh "bundle exec compass compile -s compressed --force"
  end
  sh "bundle exec jekyll build"
end

desc "Prepare deploying"
task :prepare_deploy do |t|
  mkdir_p DEPLOY_DIR unless File.directory? DEPLOY_DIR
  cd DEPLOY_DIR do
    unless File.directory? ".git"
      sh "git init"
      sh "git remote add origin #{GITHUB_REPO}"
      sh "git fetch origin"
      sh "git checkout #{GH_PAGES_BRANCH}"
    end
  end
end

desc "Deploy the site"
task :deploy => [:prepare_deploy, :generate] do |t|
  rm_rf Dir.glob("#{DEPLOY_DIR}/*")
  cp_r "#{GEN_CONTENT_DIR}/.", "#{DEPLOY_DIR}"
  cd DEPLOY_DIR do
    sh "git checkout #{GH_PAGES_BRANCH}"
    sh "git pull origin #{GH_PAGES_BRANCH}"
    sh "git add -A ."
    sh "git commit -m 'Update'" rescue nil
    sh "git push origin #{GH_PAGES_BRANCH}"
  end
end
