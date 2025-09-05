create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.profiles (id, username, role)
    values (
        new.id,
         'user_' || substr(md5(new.id::text), 1, 8),
        'user'
    );
    return new;
exception
    when others then
        raise warning 'Failed to create profile for user %: %', new.id, sqlerrm;
        return new;
end;
$$;

create trigger user_to_profile_trigger
    after insert on auth.users
    for each row execute function public.handle_new_user();